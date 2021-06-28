import React from 'react'
import { useAxiosGet } from '../Hooks/HttpRequests'
import { useState, forwardRef, useImperativeHandle } from 'react'
import axios from 'axios'

function Chats(props,ref){
    const url = 'http://127.0.0.1:8000/api/v1/chats'
    var chats = [];
    chats  = useAxiosGet(url)
    let active = props.active;
    let roomName = props.roomName;

    const divHandler = (e) =>{
        var nodes = Array.prototype.slice.call( e.currentTarget.children );
        console.log(e.target.id);
        if(e.target.id != "chats-collection"){
            let activeItem = document.getElementById(active);
            console.log(activeItem);
            if(activeItem)
              activeItem.className = "collection-item";
            e.target.className = "collection-item active";
            console.log(e.target.text);
            props.handleClick(e.target.id,e.target.text);
        }
    }
    let content =  <div className="collection" id="chats-collection" onClick={divHandler}></div>
    
    let searchIcon = document.getElementById("search-icon");
    
    const search = (e) =>{
        if(searchIcon.innerText == "search" || searchIcon.innerText == "SEARCH"){
            let search_input = document.getElementById("room_search");
            let search = search_input.value;
            const url = 'http://127.0.0.1:8000/api/v1/search/';
            axios.post(url, {
            "search": search,
            })
            .then((response) => {
                console.log(response);
                e.target.innerText = "clear";
                let icon = document.createElement("i");
                icon.className = "material-icons right";
                icon.innerText = "clear";
                icon.id = "search-icon";
                e.target.appendChild(icon);
                let collectionDiv = document.getElementById("chats-collection");
                collectionDiv.innerHTML = "";

                response.data.map(function(data, index){
                    
                    let links = document.createElement("a");
                    links.className = "collection-item";
                    
                    links.id = data.id;
                    links.innerText = data.name;
                    links.href = "#";
                    //links.onClick = props.handleClick;
                    collectionDiv.appendChild(links);
               })
            }, (error) => {
                console.log(error);
            });
        }else{
            e.target.innerText = "search";
            document.getElementById("room_search").value = "";
            let icon = document.createElement("i");
            icon.className = "material-icons right";
            icon.innerText = "search";
            icon.id = "search-icon";
            e.target.appendChild(icon);
            let collectionDiv = document.getElementById("chats-collection");
            collectionDiv.innerHTML = "";

            chats.data.map(function(data, index){

                let links = document.createElement("a");
                links.className = "collection-item";
                links.onClick = props.handleClick;
                links.id = data.id;
                links.innerText = data.name;
                links.href = "#";
                collectionDiv.appendChild(links);

           }) 
        }
    }

    useImperativeHandle(ref, () => ({
    setFromOutside (room,id) {
       let collectionDiv = document.getElementById("chats-collection");
            collectionDiv.innerHTML = "";
            chats.data.map(function(data, index){
            let links = document.createElement("a");
            links.className = "collection-item";
            links.onClick = props.handleClick;
            links.id = data.id;
            links.innerText = data.name;
            links.href = "#";
            collectionDiv.appendChild(links);

           })
    }
  }), [chats])

  if(chats.data){
         content = 
        <div className="collection" id="chats-collection" onClick={divHandler}>
              {chats.data.map(function(data, index){
                    if(index==0){
                        if(active == null){
                            active = data.id;
                            roomName = data.name;
                            props.getActiveRoomName(active,roomName);
                        }
                        
                        return  <a href="#" class="collection-item active" onClick={props.handleClick} id={data.id} key={ index }>{data.name}</a>;
                    }
                    else
                        return  <a href="#" class="collection-item" onClick={props.handleClick} id={data.id} key={ index }>{data.name}</a>;
               })}
        </div>
    }

    return (
        <div>
            <div className="input-field col s12" >
                <div className="row">
                    <div className="col s8">
                        <input placeholder="Search For Rooms" id="room_search"  type="text" className="validate" />
                    </div>
                    <div className="col s4 ">
                        <a href="#" id="search-button" className="waves-effect waves-light btn" onClick={search}><i className="material-icons right" id="search-icon">search</i>search</a>
                    </div>
                </div>
            </div>

            {content}
            
        </div>
    )
}

export default forwardRef(Chats)