from django.contrib import admin
from .models import Event, Task


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'datetime', 'completed']
    list_filter = ['completed', 'datetime']
    search_fields = ['title', 'description']
    date_hierarchy = 'datetime'


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'due_date', 'priority', 'completed']
    list_filter = ['priority', 'completed']
    search_fields = ['title']