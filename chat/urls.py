from django.urls import path

from . import views

app_name = 'chat'

urlpatterns = [
    path('', views.home, name='home'),
    path('create/', views.create_room, name='create_room'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout_request, name='logout'),
    path('search/', views.search, name='search'),
    path('chat/<str:pk>', views.chat, name='chat'),
]