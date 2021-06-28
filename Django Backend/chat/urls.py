from django.urls import path
from django.conf.urls import url, include 
from rest_framework.routers import DefaultRouter

from . import views


app_name = 'chat'


urlpatterns = [
    path('', views.home, name='home'),
    path('h', views.h, name='h'),
    path('api/v1/create/', views.create_room, name='create_room'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout_request, name='logout'),
    path('api/v1/search/', views.search, name='search'),
    path('chat/<str:pk>', views.chat, name='chat'),
    path('test/', views.test, name='test'),
    path('api/v1/chats', views.get_chat, name='get_chat'),
    #path('chats', views.get_chat, name='get_chat'),
    path('api/v1/chats/<str:pk>', views.get_messages, name='get_messages'),
]