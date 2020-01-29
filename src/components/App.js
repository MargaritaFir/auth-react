import React from 'react';
import './App.css';


class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true, // Data loading flag
            loggedIn: false, // Logged In flag
            currentUser: {},
            friends: []
        }
        this.loginUser=this.loginUser.bind(this);
        this.getUserInfoMore=this.getUserInfoMore.bind(this);
        this.checkLogin=this.checkLogin.bind(this);
        this.logOut=this.logOut.bind(this);
        this.getFriendsSearch=this.getFriendsSearch.bind(this);
        this.getAllFriends=this.getAllFriends.bind(this);
    }


    componentDidMount(){
        this.checkLogin()
    }

   
    render(){
        return (
            <div>

                { (this.state.loggedIn) ? (  
                    <div>
                        <img src={this.state.currentUser.photo} />
                        <h2>{this.state.currentUser.name}</h2>
                        <div className="status_friends"> <span> Друзей: </span> {this.state.currentUser.countFriends} </div>

                    <button value="Маргарита Беккер" onClick={this.getFriendsSearch}>getFriendsSearch</button>
                    <button onClick={this.getAllFriends}>getAllFriends</button>


                    </div>) : <h2>Hello User</h2>  }


                    {(!this.state.loggedIn) ? <button onClick={this.loginUser}>Login</button> :
                        <button onClick={this.logOut}>Logout</button>}



                     { (this.state.loggedIn) ? 
                            <div className="friends_container">

                                {this.state.friends.map((friend) => 
                        
                                    <div className="friend_card">
                                         <div class="img_friend"><img src={friend.photo} /></div>
                                        <h5>{friend.name}</h5>
                                    </div>) }

                            </div> : null }
                    
            </div>
        )
    }

    getAllFriends(){
        VK.Api.call('users.get', {
            v: '5.95'
        }, user =>
                VK.Api.call('friends.get', { // Get friends info
                    order: 'random',
                    fields: ['photo_200_orig'],
                    v: '5.95'
                }, friends => { // Response processing
                    user = user.response[0];
                    friends = friends.response.items;
                    
                    let friendsUser = friends.map(friend => {
                        return {
                            name: `${friend.first_name} ${friend.last_name}`,
                            photo: friend.photo_200_orig
                        }
                    });

                    this.setState({           
                        friends: friendsUser,
    
                    });

                    console.log(this.state);
                }));
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

    getFriendsSearch(e){

        
        // this.getAllFriends();

        let friendVal = e.target.value,
        regExp = new RegExp(friendVal, 'i'),
        firstSym = friendVal.charAt(0);
        let friends = this.state.friends;
        let searchFriends = [];

        if(friendVal.match(/[а-яa-z]/i)){

            for(let i=0; i<friends.length; i++){

                if(firstSym.toUpperCase() == friends[i].name.charAt(0) || firstSym == friends[i].name.charAt(0)){

                    if(friends[i].name.match(regExp)){
                        searchFriends.push(friends[i]);
                    }
                }
            }
            

        }
        console.log(searchFriends)

        this.setState({
            friends:searchFriends
        })

        console.log(this.state)
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
                    
                   
                    let currentUser = {
                        name: `${user.first_name} ${user.last_name}`,
                        photo: user.photo_200_orig,
                        bdate: user.bdate,
                        countFriends: friends.length
                    };
                    let friendsUser = friends.map(friend => {
                        return {
                            name: `${friend.first_name} ${friend.last_name}`,
                            photo: friend.photo_200_orig
                        }
                    });

                    
                    this.setState({ 
                        currentUser: currentUser,
                        friends: friendsUser,
                        isLoading: false,
                        loggedIn: true,
                    });

                    console.log(this.state);
                }));

     }
}

export default App;