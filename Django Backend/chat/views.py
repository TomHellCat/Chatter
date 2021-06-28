from django.shortcuts import render, redirect
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.forms import  UserCreationForm, AuthenticationForm
from django.contrib.auth import logout, authenticate, login
from django.contrib import messages

from .models import Contact, Chat, Message

from .serializers import ContactSerializer, MessageSerializer, ChatSerializer
from rest_framework import viewsets 
from rest_framework.permissions import IsAuthenticated


import json

from django.http import HttpResponse


User = get_user_model()

@api_view(['GET'])
def test(request):
    contacts = Contact.objects.all()
    print(request.user.username)
    messages = Message.objects.all()
    chats = Chat.objects.all()
    serializer1 = ChatSerializer(chats, many=True)
    serializer2 = MessageSerializer(messages, many=True)
    return Response(serializer1.data)
    
@api_view(['GET'])
def get_chat(request):
    contact = Contact.objects.get(user=request.user)
    chats = Chat.objects.filter(participants=contact)
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_messages(request,pk):
    chat = Chat.objects.get(id=pk)
    messages = chat.messages.all()
    msg = []
    for m in messages:
        msg.append({"name":m.user.username,"content":m.content,"timestamp":str(m.timestamp)})
    return HttpResponse(json.dumps(msg), content_type="application/json")

    

            

@api_view(['POST'])
def create_room(request):
    Id = '';
    if request.user.is_authenticated:
        user = request.user
        print(user)
        if request.method == 'POST':
            data = JSONParser().parse(request)
            print(data)
            user = User.objects.get(username=data['user'])
            contact = Contact.objects.get(user=user)
            chat = Chat(name=data['roomname'])
            chat.save()
            chat.participants.add(contact)
            Id = chat.id;
    else:
        print("not authenticated")
    return JsonResponse({'id': Id})
    
@api_view(['POST'])
def search(request):
    data = JSONParser().parse(request)
    search = data['search']
    print(search)
    chats = Chat.objects.filter(name__icontains=search)
    print(chats)
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)

def chat(request,pk):
    user = Contact.objects.filter(user=request.user)[0]
    chat = Chat.objects.get(id=pk)
    messages = chat.messages.all()
    chats = user.chats.all()
    return render(request, 'chat/index.html', {'chats': chats, 'username': request.user.username, 'messages':messages, 'chat':chat})
def h(request):
    if request.user.is_authenticated:
        user = Contact.objects.filter(user=request.user)[0]
        contacts = user.friends.all()
        friends = []

        for contact in contacts:
            friends.append(contact.user.username)
        chats = user.chats.all()
        Messages = []
        chat = Chat(name="Join a Room to start chatting")
        if(len(chats) != 0):
            Messages = chats[0].messages.all()
            chat = chats[0]
        return render(request, 'chat/index.html', {'chats': chats, 'username': request.user.username, 'messages':Messages, 'chat':chat})
    return render(request, 'chat/notfound.html')

def home(request):
    if request.user.is_authenticated:
        user = Contact.objects.filter(user=request.user)[0]
        contacts = user.friends.all()
        friends = []

        for contact in contacts:
            friends.append(contact.user.username)
        chats = user.chats.all()
        Messages = []
        chat = Chat(name="Join a Room to start chatting")
        if(len(chats) != 0):
            Messages = chats[0].messages.all()
            chat = chats[0]
        return render(request, 'chat/index.html', {'chats': chats, 'username': request.user.username, 'messages':Messages, 'chat':chat})
    
    if request.method == 'POST':
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}")
                return redirect("chat:h")
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")

    form = AuthenticationForm()
    return render(request = request,
                    template_name = "chat/login.html",
                    context={"form":form})

def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        print("Got")
        if form.is_valid():

            user = form.save()
            username = form.cleaned_data.get('username')
            contact = Contact(name=username,user=user)
            contact.save()
            messages.success(request, f"New account created: {username}")
            login(request, user)
            return redirect("chat:home")


        else:
            for msg in form.error_messages:
                print(msg)
                messages.error(request, f"{msg}: {form.error_messages[msg]}")

            return render(request = request,
                          template_name = "chat/register.html",
                          context={"form":form})
    

    form = UserCreationForm
    return render(request = request,
                  template_name = "chat/register.html",
                  context={"form":form})

def logout_request(request):
    logout(request)
    messages.info(request, "Logged out successfully!")
    return redirect("chat:home")