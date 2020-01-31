import React from 'react';
import CardFriend from './CardFriend'



 const FriendsContainer = (props) => 
                            <div className="friends_card_container">
                               
                                {(props.friends ===undefined) ? [] : props.friends.map((friend) => 
                                        <CardFriend {...friend} key={friend.id}/>
                                    ) 
                                }

                            </div> 

export default FriendsContainer;