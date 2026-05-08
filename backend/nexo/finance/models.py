from django.db import models
from django.conf import settings


class Transaction(models.Model):
    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    CATEGORY_CHOICES = [
        ('food', 'Comida 🍔'),
        ('transport', 'Transporte 🚗'),
        ('entertainment', 'Entretenimiento 🎬'),
        ('shopping', 'Compras 🛒'),
        ('health', 'Salud 💊'),
        ('home', 'Hogar 🏠'),
        ('education', 'Educación 📚'),
        ('travel', 'Viajes ✈️'),
        ('income', 'Ingresos 💰'),
        ('other', 'Otros 📦'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions',
        null=True,
        blank=True
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'transactions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.type} - ${self.amount}"


class Budget(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='budgets'
    )
    category = models.CharField(max_length=20, choices=Transaction.CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    period = models.CharField(max_length=10, default='monthly')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'budgets'

    def __str__(self):
        return f"{self.user.username} - {self.category}: ${self.amount}"