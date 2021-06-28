from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Contact(models.Model):
    name = models.CharField(max_length=200, blank=True)
    user = models.ForeignKey(
        User, related_name='friends', on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.user.username


class Message(models.Model):
    user = models.ForeignKey(
        User, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Chat(models.Model):
    name = models.CharField(max_length=200, blank=True)
    messages = models.ManyToManyField(Message, blank=True)
    participants = models.ManyToManyField(
        Contact, related_name='chats', blank=True)

    def __str__(self):
        return "{}".format(self.pk)





