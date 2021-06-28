import React, {useEffect} from 'react'
import { useAxiosGet } from '../Hooks/HttpRequests' 
import axios from 'axios'
import WebSocketInstance from '../websocket'; 

function ChatBox(props){

    let active = props.active;
    let chat = null;
    let chatSocket = null;

     const Send = (data) =>{
        const messageInputDom = document.querySelector('#chat-message-input');
        const message = messageInputDom.value;
        if(chatSocket){
            chatSocket.send(JSON.stringify({
                'message': message,
                'username': props.username,
                'room': active
            }));
        }
        messageInputDom.value = '';
    }

    const Welcome = (data) =>{
        if(props.roomName != null)
            return props.roomName;
        else
            return "Welcome";
    }

    const makeChatBubble = (data) =>{
        let chatDiv = document.getElementById("chats");
        for(let i = 0; i<data.length; i++){ 
          let cardDiv = document.createElement("div");
          let senderDiv = document.createElement("div");
          let contentDiv = document.createElement("div");
          let timeDiv = document.createElement("div");
          let rowDiv = document.createElement("div");

          rowDiv.className="row";
          if(data[i].name == props.username){
            cardDiv.className="card blue me";
            senderDiv.className="right sender";
          }else{
            cardDiv.className="card green her";
            senderDiv.className="left sender";
          }
          
          senderDiv.innerHTML = data[i].name;
          contentDiv.innerHTML = data[i].content;

          timeDiv.className = "time";  
          timeDiv.innerHTML = data[i].timestamp.substr(10,6);
        
          cardDiv.appendChild(senderDiv);
          cardDiv.appendChild(contentDiv);
          cardDiv.appendChild(timeDiv);
          rowDiv.appendChild(cardDiv);
          chatDiv.appendChild(rowDiv);
        }    
    }

    
    
    React.useEffect(() => {
      if(active != null){
        const url = 'http://127.0.0.1:8000/api/v1/chats/' + active;

         axios.get(url)
          .then(function (response) {
            let chatDiv = document.getElementById("chats");
            chatDiv.innerHTML = '';
            makeChatBubble(response.data);       
          })
          .catch(function (error) {
            console.log(error);
          })

        const path = 'ws://127.0.0.1:8000/ws/' + active + '/';
        chatSocket = new WebSocket(path);

        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if (data.content) {
                makeChatBubble([data]);
            } else {
                alert('The message is empty!');
            }
        };
      }
    }, [active]);


    return (

    <div className="col s7 push-s5 ">
        <div className="card grey lighten-3">

            <div className="collection" id="room-name-div">
                <a href="#" class="collection-item active">{Welcome()}</a>  
            </div>
             <div className="chat" id="chats">       
            </div>
            <div className="card" id="message-input-card">
            
                <div className="row" >
                    <div className="col s9" id="message-input-row">
                        <input placeholder="Your message" id="chat-message-input" type="text" className="validate" />
                    </div>
                    <div className="col s2" id="message-input-button">
                        <a className="waves-effect waves-light btn" onClick={Send}><i className="material-icons right">send</i>Send</a>
                    </div>
                    </div>
                </div>
               
        </div>
    </div>

    )
}

export default ChatBox