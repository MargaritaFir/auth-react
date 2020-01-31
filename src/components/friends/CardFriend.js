import React from 'react';



 const CardFriend = (props) => 
            <div className="friend_card">
                <div className="img_friend"><img src={props.photo} /></div>
                <h5>{props.name}</h5>
            </div>

export default CardFriend;