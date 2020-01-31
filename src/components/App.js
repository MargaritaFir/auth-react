import React from 'react';
import './App.css';

import FriendsContainer from './friends/FriendsContainer';
import UserInfo from './user/UserInfo';
import SearchComponent from './searchComponent/SearchComponent';


class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true, // Data loading flag
            loggedIn: false, // Logged In flag
            currentUser: {},
            friends: [], // друзья пользователя
            allFriends: [], // Для фильтрации
            query: '' // параметр ввода для инпута
        }
    }


    componentDidMount(){
        this.checkLogin()
    }

   
    render(){
        return (
            <div className="container">

                { (this.state.loggedIn) ? (  
                    <div>
                        
                        <UserInfo {...this.state.currentUser}/>

                                
                                <button onClick={this.logOut}>Logout</button>
                                
                     </div>) : (<div>
                                    <h2>Hello User</h2>
                                    <button onClick={this.loginUser}>Login</button>
                                </div>   ) }


                     { (this.state.loggedIn) ?
                     <div className="container_friends">
                         <SearchComponent query={this.state.query} onInput ={this.onInput}/>
                         <FriendsContainer friends={this.state.friends}/>

                     </div>
                     
                     
                     : null }
                    
            </div>
        )
    }

    onInput =(e) =>{

        this.setState({
          query:e.target.value
        });
        
        this.getFriendsSearch(e.target.value);
    }



    getAllFriends = () =>{

     VK.Api.call('users.get', {
            v: '5.95',
            order: 'name'
        }, user =>
                VK.Api.call('friends.get', { // Get friends info
                    order: 'name',
                    fields: ['photo_200_orig'],
                    v: '5.95'
                }, friends => { // Response processing
                    user = user.response[0];
                    friends = friends.response.items;
                    
                    let friendsUser = friends.map(friend => {
                        return {
                            name: `${friend.first_name} ${friend.last_name}`,
                            photo: friend.photo_200_orig,
                            id: friend.id
                        }
                    });

                    
                    this.setState({           
                        allFriends: friendsUser,
    
                    });


                }));

    }


    checkLogin = () => {
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


    loginUser = () => {
        VK.Auth.login((response) => { 
            if (response.session) {
                console.log(response)
              let username = response.session.user.first_name;

              console.log(username);
              this.getUserInfoMore();
               
            }})    
    }


    logOut = () => {
        VK.Auth.logout(() => this.checkLogin())
    }

    getFriendsSearch = (query) =>{
        
        this.getAllFriends();

        if(query==="" || query===null){
            
            this.setState({friends: this.state.allFriends})
        } else {

            let friendsAll = this.state.allFriends;
            console.log(this.state)

            let friendVal = query,
            regExp = new RegExp(friendVal, 'i'),
            firstSym = friendVal.charAt(0);
            let searchFriends = [];

            if(friendVal.match(/[а-яa-z]/i)){

                for(let i=0; i<friendsAll.length; i++){

                    if(firstSym.toUpperCase() == friendsAll[i].name.charAt(0) || firstSym == friendsAll[i].name.charAt(0)){

                        if(friendsAll[i].name.match(regExp)){
                        searchFriends.push(friendsAll[i]);
                        }
                     }
                }    

             }

            this.setState({
                friends:searchFriends
            })

        }    

    }

    getUserInfoMore = () =>{ 
        VK.Api.call('users.get', { // Get profile info
            fields: ['photo_200_orig,bdate,'],
            v: '5.95',
            order: 'name'
        }, user =>
                VK.Api.call('friends.get', { // Get friends info
                    order: 'name',
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
                            photo: friend.photo_200_orig,
                            id: friend.id
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