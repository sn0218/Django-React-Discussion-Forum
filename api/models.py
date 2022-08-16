from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=32, default='')
    bio = models.TextField(max_length=500, blank=True, default='')
    avatar = models.URLField(default='', blank=True)
    status = models.CharField(max_length=16, blank=True, default='')

    def __str__(self):
        return f'{self.user} profile'

class Thread(models.Model):
    TOPIC_CHOICES = (
    ("1", "Entertainment"),
    ("2", "Sports"),
    ("3", "Gaming"),
    ("4", "Music"),
    ("5", "Technology"),
    ("6", "News"),
    ("7", "Anime"),
    ("8", "Drama & Movie"),
)
    subject = models.CharField(max_length=128)
    content = models.TextField()
    creator = models.ForeignKey('User', on_delete=models.CASCADE, related_name='creator_threads')
    topic = models.CharField(max_length=32, choices=TOPIC_CHOICES, default=1)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    pinned = models.BooleanField(default=False)
    replyCount = models.IntegerField(default=0)

    def __str__(self):
        return f'Thread {self.subject}  is created by {self.creator.username}.'


class Post(models.Model):
    content = models.TextField()
    thread = models.ForeignKey('Thread', on_delete=models.CASCADE, related_name='thread_posts')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey('User', on_delete=models.CASCADE, related_name='creator_posts')

    def __str__(self):
        return f'Post of {self.thread.subject} is posted by {self.creator.username}.'





