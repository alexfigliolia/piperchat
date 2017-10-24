import React, { Component } from 'react';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';
import FriendList from './components/friendList/FriendList';
import Menu from './components/menu/Menu';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true,
			user: {
				name: 'Alex Figliolia',
				image: "cityweb-small.jpg"
			},
			burgerClasses: "hamburglar is-open",
      burgerToggle: true,
      friendListClasses: "friend-list",
      friendToggle: true,
      menuClasses: "menu",
      contacts: [
      	{
      		name: "Some Guy",
      		online: true,
      		image: "cityweb-small.jpg"
      	},
      	{
      		name: "Another Guy",
      		online: false,
      		image: "cityweb-small.jpg"
      	},
      	{
      		name: "Dis Guy",
      		online: true,
      		image: "cityweb-small.jpg"
      	}
      ],
      height: window.innerHeight,
      width: window.innerWidth
		}
		this.loader = document.getElementById('appLoader');
	}

	componentDidMount() {
		if(this.loader !== null) {
			this.loader.remove();
		}
		console.log(window.navigator.mediaDevices);
		window.addEventListener('resize', () => {
			this.setState({ height: window.innerHeight, width: window.innerWidth });
		});
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		if(nextProps.id !== null) {
			this.setState({ loggedIn: true });
		} else {
			this.setState({ loggedIn: false });
		}
	}

	toggleBurger = () => {
		if(!this.state.friendToggle) {
  		this.toggleFriends();
  	}
    this.setState((prevState, prevProps) => {
      return {
        burgerToggle : !prevState.burgerToggle,
        burgerClasses : (prevState.burgerClasses === "hamburglar is-closed") ? 
                          "hamburglar is-open" : 
                          "hamburglar is-closed",
       	menuClasses: (prevState.menuClasses === "menu") ?
       								"menu menu-show" :
       								"menu"
      }
    });
  }

  toggleFriends = () => {
  	if(!this.state.burgerToggle) {
  		this.toggleBurger();
  	}
    this.setState((prevState, prevProps) => {
      return {
      	friendToggle : !prevState.friendToggle,
        friendListClasses: prevState.friendListClasses === "friend-list" ?
        										"friend-list friend-list-show" :
        										"friend-list"
      }
    });
  }

	render = () => {
		return(
			<section className="App" style={{height: window.innerHeight}}>

				{
					!this.state.loggedIn &&
					<Login />
				}

				{
					this.state.loggedIn &&
					<Header
						burgerStuff={this.state.burgerClasses}
						burger={this.toggleBurger}
						friends={this.toggleFriends} />
				}

				{
					this.state.loggedIn &&
					<Dashboard
						height={this.state.height}
						width={this.state.width} />
				}

				{
					this.state.loggedIn &&
					<FriendList
						classes={this.state.friendListClasses}
						contacts={this.state.contacts} />
				}

				{
					this.state.loggedIn &&
					<Menu
						classes={this.state.menuClasses}
						user={this.state.user} />
				}

			</section>
		);
	}
}