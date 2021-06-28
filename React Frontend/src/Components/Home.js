import React, { Component } from "react";
import Chat from './Chat'
import ChatBox from './ChatBox'

import { withRouter } from "react-router-dom";  
import { connect } from "react-redux";      

import PropTypes from "prop-types";  

import { logout } from "./Login/LoginActions.js"; 
import axios from 'axios'
import WebSocketInstance from '../websocket'; 


class Home extends Component {
    

    constructor(props){
      super(props);
      this.state = {active:null,roomName:"Welcome"};
      this.chatBox = null;
    }

     onLogout = () => {
        this.props.logout();
    };
    getActiveRoomName = (active,roomName) =>{
      this.active = active;
      this.roomName = roomName;
      this.setState({ active: active, roomName:roomName });

    }
    handleClick = (active,roomName) =>{
      this.roomName = roomName;
      this.active = active;
    }

    renderChatBox = (data,username,roomName) =>{
      return(
       < ChatBox active={data} username={username} roomName={roomName}/>)
    }

  render() {
    const { user } = this.props.auth;

    return (
      <div>
         <nav id="nav"> 
            <div class="nav-wrapper teal lighten-2">
              <a href="#" class="brand-logo center">Chatter</a>
              <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><a href="#">{user.username}</a></li>
                <li><a onClick={this.onLogout}>Logout</a></li>
              </ul>     
            </div>
          </nav>


          {this.renderChatBox(this.active,user.username, this.roomName)}
          
          <Chat handleClick={this.handleClick} getActiveRoomName={this.getActiveRoomName} active={this.active} username={user.username}/>
      </div>
    );
  }
}

Home.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  logout
})(withRouter(Home));
