import json
import os
import re
from datetime import datetime, timedelta
from decimal import Decimal

import requests
from django.conf import settings
from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from nexo.finance.models import Transaction, Budget
from nexo.agenda.models import Event, Task
from nexo.contacts.models import Contact
from nexo.core.models import Conversation
from api.serializers import (
    TransactionSerializer, EventSerializer, TaskSerializer,
    ContactSerializer, ConversationSerializer
)


def extract_amount(text):
    match = re.search(r'\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)', text)
    if match:
        return Decimal(match.group(1).replace(',', ''))
    return None


def extract_category(text):
    categories = {
        'comida': 'food', 'almuerzo': 'food', 'cena': 'food', 'desayuno': 'food',
        'restaurante': 'food', 'uber eats': 'food', 'pedidos': 'food',
        'taxi': 'transport', 'uber': 'transport', 'nafta': 'transport', 'gasolina': 'transport', 'metro': 'transport',
        'pelicula': 'entertainment', 'netflix': 'entertainment', 'spotify': 'entertainment', 'cine': 'entertainment',
        'ropa': 'shopping', 'zapatos': 'shopping', 'amazon': 'shopping', 'tienda': 'shopping',
        'doctor': 'health', 'medicina': 'health', 'farmacia': 'health', 'hospital': 'health',
        'luz': 'home', 'agua': 'home', 'internet': 'home', 'alquiler': 'home',
        'curso': 'education', 'libro': 'education', 'universidad': 'education', 'escuela': 'education',
        'vuelo': 'travel', 'hotel': 'travel', 'vacaciones': 'travel',
        'sueldo': 'income', 'salario': 'income', 'pago': 'income', 'ingreso': 'income',
    }
    text_lower = text.lower()
    for keyword, category in categories.items():
        if keyword in text_lower:
            return category
    return 'other'


def call_deepseek(user_message, context=None):
    system_prompt = """Eres NEXO, un asistente de IA personal en el celular. Respondes en JSON.

Tus capacidades:
1. Registrar gastos/ingresos ("Gasté $50 en almuerzo")
2. Ver resumen financiero ("Cuánto gasté esta semana?")
3. Agregar eventos ("Tengo reunión mañana a las 9")
4. Ver agenda ("Qué tengo hoy?")
5. Llamar/Escribir contactos ("Llamá a mi esposa", "Escribele a Juan")
6. Buscar lugares ("Hay sushi cerca?")
7. Tareas ("Agregar comprar leche a mi lista")

Responde SOLO con JSON válido, sin markdown:
{
  "action": "financial_add|financial_summary|event_add|agenda_view|contact_call|contact_message|search_local|task_add|general",
  "params": {
    "amount": 50,
    "category": "food",
    "contact_name": "esposa",
    "message": "texto a enviar",
    "query": "búsqueda",
    "title": "título del evento"
  },
  "response": "Tu respuesta al usuario en español, corta y amigable"
}"""

    try:
        response = requests.post(
            f"{settings.DEEPSEEK_BASE_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": settings.DEEPSEEK_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.3
            },
            timeout=30
        )
        result = response.json()
        content = result['choices'][0]['message']['content']
        content = content.strip()
        if content.startswith('```json'):
            content = content[7:]
        if content.startswith('```'):
            content = content[3:]
        if content.endswith('```'):
            content = content[:-3]
        return json.loads(content.strip())
    except Exception as e:
        return {
            "action": "general",
            "params": {},
            "response": f"No pude procesar eso. Intenta de nuevo. Error: {str(e)}"
        }


@api_view(['POST'])
@permission_classes([AllowAny])
def nexo_chat(request):
    user_message = request.data.get('message', '')
    user = request.user if request.user.is_authenticated else None

    Conversation.objects.create(
        user=user,
        message=user_message,
        direction='in'
    )

    result = call_deepseek(user_message)

    action = result.get('action', 'general')
    params = result.get('params', {})
    nexo_response = result.get('response', 'Entendido')

    response_data = {
        'action': action,
        'response': nexo_response,
        'params': params
    }

    if user:
        if action == 'financial_add' and params.get('amount'):
            amount = params.get('amount')
            category = params.get('category', extract_category(user_message))
            transaction = Transaction.objects.create(
                user=user,
                type='expense' if amount > 0 else 'income',
                amount=abs(amount),
                category=category,
                description=user_message
            )
            response_data['transaction'] = TransactionSerializer(transaction).data

        elif action == 'financial_summary':
            today = timezone.now().date()
            week_start = today - timedelta(days=today.weekday())
            month_start = today.replace(day=1)

            today_expenses = Transaction.objects.filter(
                user=user, type='expense', created_at__date=today
            ).aggregate(total=Sum('amount'))['total'] or 0

            week_expenses = Transaction.objects.filter(
                user=user, type='expense', created_at__date__gte=week_start
            ).aggregate(total=Sum('amount'))['total'] or 0

            month_expenses = Transaction.objects.filter(
                user=user, type='expense', created_at__date__gte=month_start
            ).aggregate(total=Sum('amount'))['total'] or 0

            month_income = Transaction.objects.filter(
                user=user, type='income', created_at__date__gte=month_start
            ).aggregate(total=Sum('amount'))['total'] or 0

            response_data['summary'] = {
                'today': float(today_expenses),
                'week': float(week_expenses),
                'month_expenses': float(month_expenses),
                'month_income': float(month_income),
                'balance': float(month_income) - float(month_expenses)
            }

        elif action == 'event_add' and params.get('title'):
            event_date = params.get('datetime', timezone.now() + timedelta(hours=1))
            event = Event.objects.create(
                user=user,
                title=params['title'],
                description=params.get('description', ''),
                datetime=event_date,
                location=params.get('location', '')
            )
            response_data['event'] = EventSerializer(event).data

        elif action == 'agenda_view':
            view_type = params.get('view', 'today')
            if view_type == 'today':
                start = timezone.now().replace(hour=0, minute=0, second=0)
                end = start + timedelta(days=1)
            else:
                start = timezone.now().replace(hour=0, minute=0, second=0) + timedelta(days=1)
                end = start + timedelta(days=1)

            events = Event.objects.filter(user=user, datetime__gte=start, datetime__lt=end)
            tasks = Task.objects.filter(user=user, due_date__gte=start, due_date__lt=end, completed=False)

            response_data['events'] = EventSerializer(events, many=True).data
            response_data['tasks'] = TaskSerializer(tasks, many=True).data

        elif action == 'task_add' and params.get('title'):
            task = Task.objects.create(
                user=user,
                title=params['title'],
                priority=params.get('priority', 'medium')
            )
            response_data['task'] = TaskSerializer(task).data

    Conversation.objects.create(
        user=user,
        message=nexo_response,
        direction='out',
        action_taken={'action': action, 'params': params}
    )

    return Response(response_data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def transactions(request):
    user = request.user if request.user.is_authenticated else None
    if not user:
        return Response({'error': 'Not authenticated'}, status=401)
    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=user)[:50]
        return Response(TransactionSerializer(transactions, many=True).data)
    else:
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def events(request):
    user = request.user if request.user.is_authenticated else None
    if not user:
        return Response({'error': 'Not authenticated'}, status=401)
    if request.method == 'GET':
        events = Event.objects.filter(user=user, datetime__gte=timezone.now())[:20]
        return Response(EventSerializer(events, many=True).data)
    else:
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def tasks(request):
    user = request.user
    if request.method == 'GET':
        tasks = Task.objects.filter(user=user, completed=False)[:20]
        return Response(TaskSerializer(tasks, many=True).data)
    else:
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def contacts(request):
    user = request.user
    if request.method == 'GET':
        query = request.GET.get('q', '')
        if query:
            contacts = Contact.objects.filter(user=user, name__icontains=query)[:10]
        else:
            contacts = Contact.objects.filter(user=user)[:50]
        return Response(ContactSerializer(contacts, many=True).data)
    else:
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Not authenticated'}, status=401)
    user = request.user
    today = timezone.now().date()
    month_start = today.replace(day=1)

    month_expenses = Transaction.objects.filter(
        user=user, type='expense', created_at__date__gte=month_start
    ).aggregate(total=Sum('amount'))['total'] or 0

    month_income = Transaction.objects.filter(
        user=user, type='income', created_at__date__gte=month_start
    ).aggregate(total=Sum('amount'))['total'] or 0

    upcoming_events = Event.objects.filter(
        user=user, datetime__gte=timezone.now()
    ).order_by('datetime')[:5]

    pending_tasks = Task.objects.filter(
        user=user, completed=False
    ).order_by('due_date')[:5]

    return Response({
        'balance': float(month_income) - float(month_expenses),
        'month_expenses': float(month_expenses),
        'month_income': float(month_income),
        'upcoming_events': EventSerializer(upcoming_events, many=True).data,
        'pending_tasks': TaskSerializer(pending_tasks, many=True).data
    })


@api_view(['POST'])
def register_expense(request):
    text = request.data.get('text', '')
    amount = extract_amount(text)
    category = extract_category(text)

    if not amount:
        return Response({'error': 'No se detectó monto'}, status=400)

    transaction = Transaction.objects.create(
        user=request.user,
        type='expense',
        amount=amount,
        category=category,
        description=text
    )

    return Response(TransactionSerializer(transaction).data)


@api_view(['GET'])
def agenda_today(request):
    user = request.user
    start = timezone.now().replace(hour=0, minute=0, second=0)
    end = start + timedelta(days=1)

    events = Event.objects.filter(user=user, datetime__gte=start, datetime__lt=end)
    tasks = Task.objects.filter(user=user, due_date__gte=start, due_date__lt=end)
    transactions = Transaction.objects.filter(user=user, created_at__gte=start, created_at__lt=end)

    return Response({
        'events': EventSerializer(events, many=True).data,
        'tasks': TaskSerializer(tasks, many=True).data,
        'transactions': TransactionSerializer(transactions, many=True).data,
        'date': today.strftime('%Y-%m-%d')
    })


@api_view(['GET'])
def agenda_tomorrow(request):
    user = request.user
    tomorrow = timezone.now().date() + timedelta(days=1)
    start = timezone.make_aware(datetime.combine(tomorrow, datetime.min.time()))
    end = start + timedelta(days=1)

    events = Event.objects.filter(user=user, datetime__gte=start, datetime__lt=end)
    tasks = Task.objects.filter(user=user, due_date__gte=start, due_date__lt=end)

    return Response({
        'events': EventSerializer(events, many=True).data,
        'tasks': TaskSerializer(tasks, many=True).data,
        'date': tomorrow.strftime('%Y-%m-%d')
    })