import React from 'react';
import './App.css';


class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true, // Data loading flag
            loggedIn: false, // Logged In flag
            info: {} // Profile and friendlist info
        }
        this.loginUser=this.loginUser.bind(this);
        this.getUserInfoMore=this.getUserInfoMore.bind(this);
        this.checkLogin=this.checkLogin.bind(this);
        this.logOut=this.logOut.bind(this);
    }


    componentDidMount(){
        this.checkLogin()
    }

   
    render(){
        return (
            <div>

                { (this.state.loggedIn) ? (  
                    <div>
                        <img src={this.state.info.currentUser.photo} />
                        <h2>{this.state.info.currentUser.name}</h2>
                        <div className="status_friends"> <span> Друзей: </span> {this.state.info.currentUser.countFriends} </div>


                    </div>) : <h2>Hello User</h2>  }


                    {(!this.state.loggedIn) ? <button onClick={this.loginUser}>Login</button> :
                        <button onClick={this.logOut}>Logout</button>}



                     { (this.state.loggedIn) ? 
                            <div className="friends_container">

                                {this.state.info.friends.map((friend) => 
                        
                                    <div className="friend_card">
                                         <div class="img_friend"><img src={friend.photo} /></div>
                                        <h5>{friend.name}</h5>
                                    </div>) }

                            </div> : null }
                    
            </div>
        )
    }

    checkLogin() {
        this.setState({ isLoading: true });
        VK.Auth.getLoginStatus(event => {
            if (event.status === "connected")
                this.getUserInfoMore();
            else
                this.setState({
                    isLoading: false,
                    loggedIn: false
                });
        });
    }


    loginUser()  {
        VK.Auth.login((response) => { 
            if (response.session) {
                console.log(response)
              let username = response.session.user.first_name;

              console.log(username);
              this.getUserInfoMore();
               
            }})    
    }


    logOut() {
        VK.Auth.logout(() => this.checkLogin())
    }

    getUserInfoMore(){
        VK.Api.call('users.get', { // Get profile info
            fields: ['photo_200_orig,bdate,'],
            v: '5.95'
        }, user =>
                VK.Api.call('friends.get', { // Get friends info
                    order: 'random',
                    fields: ['photo_200_orig, '],
                    v: '5.95'
                }, friends => { // Response processing
                    user = user.response[0];
                    friends = friends.response.items;
                    
                    let info = {};
                    info.currentUser = {
                        name: `${user.first_name} ${user.last_name}`,
                        photo: user.photo_200_orig,
                        bdate: user.bdate,
                        countFriends: friends.length
                    };
                    info.friends = friends.map(friend => {
                        return {
                            name: `${friend.first_name} ${friend.last_name}`,
                            photo: friend.photo_200_orig
                        }
                    });

                    
                    this.setState({ 
                        info: info,
                        isLoading: false,
                        loggedIn: true,
                    });

                    console.log(info);
                }));

     }
}

export default App;