from django.contrib import admin
from .models import Conversation, UserPreference


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['user', 'direction', 'created_at']
    list_filter = ['direction', 'created_at']
    search_fields = ['message']


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'daily_budget', 'monthly_budget', 'morning_summary', 'voice_enabled']
    list_filter = ['morning_summary', 'evening_summary', 'voice_enabled']