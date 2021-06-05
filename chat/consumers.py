import json
#from .models import Message

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Chat,Contact,Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
        else:
            print("not authenticated")
            return

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
        self.user = self.scope["user"]
        print(self.user.username)
        

        await self.save_message(room, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': self.user.username
            }
        )
    
    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user = event['user']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user': user
        }))


    @sync_to_async
    def save_message(self, room, content):
        contact = Contact.objects.get(user=self.user)
        print(contact)
        chat = Chat.objects.get(id=room)
        participants = chat.participants.all()

        if(not contact in participants):
            chat.participants.add(contact)
        message = Message(contact=contact,content=content)
        message.save()
        chat.messages.add(message)
        chat.save()