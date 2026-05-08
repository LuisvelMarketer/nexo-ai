from django.db import models
from django.conf import settings


class Conversation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations'
    )
    message = models.TextField()
    direction = models.CharField(max_length=10, choices=[('in', 'Input'), ('out', 'Output')])
    action_taken = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'conversations'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.username} - {self.direction} - {self.created_at}"


class UserPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='preference'
    )
    daily_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    morning_summary = models.BooleanField(default=True)
    evening_summary = models.BooleanField(default=True)
    notification_time = models.TimeField(null=True, blank=True)
    voice_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_preferences'

    def __str__(self):
        return f"Preferences for {self.user.username}"