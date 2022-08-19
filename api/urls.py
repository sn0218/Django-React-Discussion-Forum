from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('threads/', views.getThreads, name='threads'),
    path('threads/<int:thread_id>', views.getThread, name='thread'),
    path('threads/<int:thread_id>/posts', views.getPosts, name='posts'),
    path('topThreads/', views.getTopThreads, name="topThreads"),
    path('threads/topic/<int:topic_id>', views.getThreadsTopic, name='getThreadsTopic'),
    path('createThread/', views.createThread, name='createThread'),
    path('createPost/', views.createPost, name='createPost'),
    path('pin/', views.bookmark, name='bookmark'),
    path('pin/<int:thread_id>&&<int:user_id>', views.checkBookmarked, name='checkBookmarked'),
    path('bookmark/<int:user_id>', views.getBookmarkedThreads, name="getBookmarkedThreads"),
    path('profile/<int:user_id>', views.profile, name='profile'),

]
