from rest_framework import serializers
from django.contrib.auth import get_user_model
from nexo.users.models import User
from nexo.finance.models import Transaction, Budget
from nexo.agenda.models import Event, Task
from nexo.contacts.models import Contact
from nexo.core.models import Conversation, UserPreference

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'preferences', 'created_at']
        read_only_fields = ['id', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'type', 'amount', 'category', 'description', 'recurring', 'created_at']
        read_only_fields = ['id', 'created_at']


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'category', 'amount', 'period', 'created_at']
        read_only_fields = ['id', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'datetime', 'location', 'contact_name', 
                  'contact_phone', 'reminder_minutes', 'completed', 'created_at']
        read_only_fields = ['id', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'due_date', 'completed', 'priority', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'phone', 'whatsapp', 'email', 'relationship', 'birthday', 'created_at']
        read_only_fields = ['id', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'message', 'direction', 'action_taken', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ['daily_budget', 'monthly_budget', 'morning_summary', 'evening_summary', 
                  'notification_time', 'voice_enabled']