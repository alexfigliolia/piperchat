import React, { Component } from 'react';
import update from 'immutability-helper';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';
import FriendList from './components/friendList/FriendList';
import Menu from './components/menu/Menu';
import Chatbox from './components/chatbox/Chatbox';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true,
			user: { name: 'Alex Figliolia', image: "cityweb-small.jpg" },
			burgerClasses: "hamburglar is-open",
      burgerToggle: true,
      friendListClasses: "friend-list",
      friendToggle: true,
      menuClasses: "menu",
      contacts: [
      	{ name: "Steve Figliolia", online: true, image: "cityweb-small.jpg" },
      	{ name: "Erica Figliolia", online: false, image: "cityweb-small.jpg" },
      	{ name: "George Figliolia", online: true, image: "cityweb-small.jpg" }
      ],
      search: [
      	{ name: "Steve Figliolia", online: true, image: "cityweb-small.jpg" },
      	{ name: "Erica Figliolia", online: false, image: "cityweb-small.jpg" },
      	{ name: "George Figliolia", online: true, image: "cityweb-small.jpg" }
      ],
      height: window.innerHeight,
      width: window.innerWidth,
      currentChats: [ "Steve Figliolia", "Erica Figliolia" ]
		}
		this.loader = document.getElementById('appLoader');
	}

	componentDidMount() {
		if(this.loader !== null) {
			this.loader.remove();
		}
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

  handleNewImage = (img) => {
  	const s = this.state.user;
  	const ns = update(s, {image: {$set: img}});
  	this.setState({user: ns});
  }

  updateName = (name) => {
  	const s = this.state.user;
  	const ns = update(s, {name: {$set: name}});
  	this.setState({user: ns});
  }

  handleSearch = (val) => {
  	const results = [];
    for(let i = 0; i < this.state.contacts.length; i++) {
      let friend = this.state.contacts[i].name.toLowerCase();
      if(friend.indexOf(val.toLowerCase()) !== -1) {
        results.push(this.state.contacts[i]);
      }
    }
    this.setState({ search: results });
  }

  closeChat = (e) => {
  	const i = e.target.dataset.index;
  	const cc = this.state.currentChats;
  	const ns = update(cc, {$splice: [[[i], 1]]});
  	this.setState({currentChats: ns});
  }

  openChat = (e) => {
  	const name = e.target.dataset.with;
  	const cc = this.state.currentChats;
  	if(cc.indexOf(name) === -1) {
  		const ns = update(cc, {$push: [name]});
  		this.setState({currentChats: ns});
  	}
  	this.toggleFriends();
  }

	render = () => {
		return(
			<section 
				className="App" 
				style={{height: window.innerHeight}}>

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
						search={this.state.search}
						handleSearch={this.handleSearch}
						openChat={this.openChat} />
				}

				{
					this.state.loggedIn &&
					<Menu
						classes={this.state.menuClasses}
						user={this.state.user}
						handleNewImage={this.handleNewImage}
						updateName={this.updateName} />
				}

				{
					this.state.width < 957 ?
					this.state.currentChats.length > 0 &&
					 <Chatbox
							index={this.state.currentChats.length - 1}
							with={this.state.currentChats[this.state.currentChats.length - 1]}
							left={0}
							closeChat={this.closeChat} />	
					: this.state.currentChats.map((chat, i) => {
						return <Chatbox
											index={i}
											key={i}
											with={chat}
											left={i}
											width={this.state.currentChats.length}
											closeChat={this.closeChat} />	
					})
				}

			</section>
		);
	}
}