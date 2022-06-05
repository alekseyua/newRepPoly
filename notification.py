from django.db import models
from .profile import Profile
from django.dispatch import receiver
from django.db.models import signals
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from user.tasks import send_message_all
from django.conf import settings
from push_notifications.models import WebPushDevice


class Notification(models.Model):

    profile = models.ForeignKey(
        Profile, verbose_name='Профиль пользователя', related_name='notifications', on_delete=models.CASCADE, blank=True, null=True)
    message = models.CharField(verbose_name='Текст уведомления', max_length=255, blank=True, null=True, default='')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    is_read = models.BooleanField(verbose_name='Прочитано', default=False)
    is_all = models.BooleanField(verbose_name='Всем', default=False)
    is_new = models.BooleanField(verbose_name='Новое', default=True)
    is_new_wp = models.BooleanField(verbose_name='Новое wp', default=True)

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'
        ordering = ['-id',]

    def __str__(self):
        return f'{self.created_at} {self.profile} - {self.message}'

@receiver(models.signals.post_save, sender=Notification)
def send_all(sender, instance, using, **kwargs):
    if instance.is_all == True:
        #profiles = Profile.objects.all()
        send_message_all.delay(instance.profile, instance.message)
        """for profile in profiles:
            if instance.profile != profile:
                notification = Notification(profile=profile, message=instance.message, created_at=instance.created_at)
                notification.save()"""


@receiver(signals.post_save, sender=Notification)
def notify_chat(sender, instance, **kwargs):
    if kwargs['created'] and instance.is_all != True:
        group_name = "notifications_" + str(instance.profile.id)#str(instance.profile.user.id)
        channel_layer = get_channel_layer()
        from ..serializers import NotificationSerializer
        answer = NotificationSerializer(instance).data
        async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "chat.message",
            "notification": answer,
        },
        )

@receiver(models.signals.post_save, sender=Notification)
def send_note(sender, instance, using, **kwargs):
    if instance.is_new_wp == True:
        from user.models import Manager
        from push_notifications.models import WebPushDevice
        user = instance.profile.user
        try:
            text = instance.message
            device = WebPushDevice.objects.filter(user__id=user.id).first()
            device.send_message(text)

        except:
            pass
        instance.is_new_wp = False
        instance.save()
