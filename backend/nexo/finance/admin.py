from django.contrib import admin
from .models import Transaction, Budget


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'amount', 'category', 'created_at']
    list_filter = ['type', 'category', 'created_at']
    search_fields = ['description', 'user__username']
    date_hierarchy = 'created_at'


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['user', 'category', 'amount', 'period']
    list_filter = ['category', 'period']