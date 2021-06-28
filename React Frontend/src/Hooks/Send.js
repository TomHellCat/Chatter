import {useEffect, useState} from 'react'


export function Send(e){
    if(e.target.className === "collection-item active"){
        e.target.className = "collection-item"
    }else{
        e.target.className = "collection-item active"
    }
    e.props.messageFromChild('something');
    
}
