from django.shortcuts import render, redirect

from django.contrib.auth.forms import  UserCreationForm, AuthenticationForm
from django.contrib.auth import logout, authenticate, login
from django.contrib import messages

from .models import Contact, Chat, Message

def create_room(request):
    if request.user.is_authenticated:
        user = request.user
        if request.method == 'POST':
            room_name = request.POST.get('textfield', None)
            chat = Chat(name=room_name)
            chat.save()
            chat.participants.add(Contact.objects.get(user=request.user))
            print(" ", chat.participants.all())
            print(room_name)
            return redirect("chat:chat", chat.id)
    return render(request,'chat/notfound.html')

def search(request):
    if(request.method == 'POST'):
        search = request.POST.get('textfield', None)
        print(search)
        users = Contact.objects.filter(name__icontains=search)
        chats = Chat.objects.filter(name__icontains=search)
        print(chats)
        chat = Chat(name="Join a Room to start chatting")
        return render(request,'chat/index.html',{'chats':chats, 'username': request.user.username, 'messages':[], 'chat':chat})
    return render(request,'chat/search.html')

def chat(request,pk):
    user = Contact.objects.filter(user=request.user)[0]
    chat = Chat.objects.get(id=pk)
    messages = chat.messages.all()
    chats = user.chats.all()
    return render(request, 'chat/index.html', {'chats': chats, 'username': request.user.username, 'messages':messages, 'chat':chat})

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
                return redirect("chat:home")
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