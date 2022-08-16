from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes, name='getRoute'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('threads/', views.getThreads, name='threads'),
    path('threads/<int:thread_id>', views.getThread, name='thread'),
    path('threads/<int:thread_id>/posts', views.getPosts, name='posts'),
    path('createThread/', views.createThread, name='createThread'),
    path('createPost/', views.createPost, name='createPost')
]
