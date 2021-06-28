import React, {useEffect, useState, useRef} from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Chats from './Chats'
import { withRouter } from "react-router-dom";  // new import 
import { connect } from "react-redux";          // new import 
import PropTypes from "prop-types";
import { useAxiosGet } from '../Hooks/HttpRequests'  
import axios from 'axios'


function Chat(props) {
    const fref = useRef();
    
    

    const handleClick = (id) =>{
      let room = document.getElementById("create_room").value;
      console.log(room);
      console.log(id);
      fref.current.setFromOutside(room,id);
    }

    const postRoomData = (e) =>{

      let roomName = document.getElementById("create_room").value;
      console.log(roomName);
      document.getElementById("create_room").value = "";
      const url = 'http://127.0.0.1:8000/api/v1/create/';
      axios.post(url, {
        roomname: roomName,
        user: props.username
      })
      .then((response) => {
        console.log(response);
        if(response.statusText == "OK"){
          handleClick(response.data.id);
        }
       
      }, (error) => {
        console.log(error);
      });
    }

  return (
    <div className="col s5 pull-s7  ">
         <div className="card grey lighten-3">
              <Chats handleClick={props.handleClick}
              getActiveRoomName={props.getActiveRoomName} active={props.active} roomName={props.roomName}
             ref={fref}/>
             
                  <div className="card" id="create-room-card">
                  <div class="card-content">
                        <span class="card-title">Create Room</span>

                        
                            <div className="row">
                                <div class="col s8">
                                    <input placeholder="Enter Room Name" id="create_room" type="text" className="validate" />
                                </div>
                                <div className="col s4 ">
                                    <a className="waves-effect waves-light btn" onClick={postRoomData}><i className="material-icons right">add</i>Create</a>
                                </div>
                            </div>
                        
                    </div>
                  </div>  
                
          </div>
     </div>
  );
}


export default Chat


