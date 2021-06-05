console.log("it worked");
/*
document.querySelector('#room-name-input').focus();
const userName = JSON.parse(document.getElementById('json-username').textContent);
document.querySelector('#room-name-submit').onclick = function(e) {
    var roomName = document.querySelector('#room-name-input').value;
    

    window.location.replace(roomName + '/?username=' + userName);
};
             /*function scrollToBottom() {
                let objDiv = document.getElementById("chat-messages");
                objDiv.scrollTop = objDiv.scrollHeight;
            }

            scrollToBottom();
            const roomName = JSON.parse(document.getElementById('json-roomname').textContent);
            const userName = JSON.parse(document.getElementById('json-username').textContent);

            const chatSocket = new WebSocket(
                'ws://'
                + window.location.host
                + '/ws/'
                + roomName
                + '/'
            );

            chatSocket.onmessage = function(e) {
                console.log('onmessage');

                const data = JSON.parse(e.data);

                if (data.message) {
                    document.querySelector('#chat-messages').innerHTML += ('<b>' + data.username + '</b>: ' + data.message + '<br>');
                } else {
                    alert('The message is empty!');
                }

                scrollToBottom();

                
            };

             document.querySelector('#chat-message-input').focus();
            document.querySelector('#chat-message-input').onkeyup = function(e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#chat-message-submit').click();
            }
        };

            chatSocket.onclose = function(e) {
                console.log('The socket close unexpectadly');
            };

            document.querySelector('#chat-message-submit').onclick = function(e) {
                const messageInputDom = document.querySelector('#chat-message-input');
                const message = messageInputDom.value;

                chatSocket.send(JSON.stringify({
                    'message': message,
                    'username': userName,
                    'room': roomName
                }));

                messageInputDom.value = '';
            };*/
