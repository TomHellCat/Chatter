import React from 'react'

import { useAxiosGet } from '../Hooks/HttpRequests'


function Test(){
  const url = 'http://127.0.0.1:8000/test/'
  let chats = useAxiosGet(url)

  let content = null
  if(chats.data){
        content = 
        <div>
            <h1 className="text-2xl font-bold mb-3">
                {chats.data[0].name}
            </h1>
        </div>
    }
     return (
        <div>
            {content}
        </div>
    )
}

export default Test