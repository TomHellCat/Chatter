import json
from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Chat,Contact,Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.user = self.scope["user"]
        print(self.user)
        
        print(self.room_group_name)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

     # Receive message from web socket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        room = data['room']
        user = data['username']
        
        print(user)
        

        time = await self.save_message(room, message,user)
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': user,
                'time':time
            }
        )
    
    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user = event['user']
        time = event['time']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'content': message,
            'name': user,
            'timestamp': time
        }))


    def fetch_messages(self, data):
        chat = Chat.objects.get(id=self.room_name)
        messages = chat.messages.all()
        messages = Message.last_10_messages()
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': message.id,
            'author': message.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    commands = {
        'fetch_messages': fetch_messages
    }

    @sync_to_async
    def save_message(self, room, content,username):
        userName = User.objects.get(username=username)
        contact = Contact.objects.get(user=userName)
        print(contact)
        chat = Chat.objects.get(id=room)
        participants = chat.participants.all()

        if(not contact in participants):
            chat.participants.add(contact)
        message = Message(user=userName,content=content)
        message.save()
        chat.messages.add(message)
        chat.save()
        return str(message.timestamp);

        