from django.urls import path
from api import views

urlpatterns = [
    path('chat/', views.nexo_chat, name='nexo-chat'),
    path('transactions/', views.transactions, name='transactions'),
    path('events/', views.events, name='events'),
    path('tasks/', views.tasks, name='tasks'),
    path('contacts/', views.contacts, name='contacts'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('expense/', views.register_expense, name='register-expense'),
    path('agenda/today/', views.agenda_today, name='agenda-today'),
    path('agenda/tomorrow/', views.agenda_tomorrow, name='agenda-tomorrow'),
]