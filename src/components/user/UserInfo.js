import React from 'react';


const UserInfo = (props) => 
                    <div>
                        <img src={props.photo} />
                        <h2>{props.name}</h2>
                        <div className="status_friends"> <span> Друзей: </span> {props.countFriends} </div>
                        
                    </div>


export default UserInfo;