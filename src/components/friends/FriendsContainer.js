import React from 'react';
import CardFriend from './CardFriend'



 const FriendsContainer = (props) => 
                            <div className="friends_container">
                                {props.friends.map((friend) => 
                                        <CardFriend {...friend} key={friend.id}/>
                                    ) 
                                }
                            </div> 

export default FriendsContainer;