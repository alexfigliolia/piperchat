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
			loggedIn: false,
			user: null,
			burgerClasses: "hamburglar is-open",
      burgerToggle: true,
      friendListClasses: "friend-list",
      friendToggle: true,
      menuClasses: "menu",
      loginClasses: "login",
      contacts: [],
      search: [],
      requests: [],
      sentRequests: [],
      height: window.innerHeight,
      width: window.innerWidth,
      currentChats: [],
      currentSearch: ''
		}
		this.loader = document.getElementById('appLoader');
	}

	componentDidMount() {
		window.addEventListener('resize', () => {
			this.setState({ height: window.innerHeight, width: window.innerWidth });
		});
	}

	componentWillReceiveProps(nextProps) {
		if(this.props !== nextProps) {
			console.log(nextProps);
			if(nextProps.user === null || nextProps.user === undefined) {
				this.needsAuth();
			} else {
				this.letEmIn(nextProps);
			}
		}
	}

	needsAuth = () => {
		if(this.loader !== null) {
			this.loader.classList.add('app-loader-hidden-op');
			this.setState({ loggedIn: false, user: null, burgerClasses: "hamburglar is-open", burgerToggle: true, friendListClasses: "friend-list", friendToggle: true, menuClasses: "menu" });
			setTimeout(() => { 
				this.loader.remove();
				this.setState({ loginClasses: "login login-show "})
			 }, 600);
		} else {
			this.setState({ loggedIn: false, loginClasses: "login login-show "});
		}
	}

	letEmIn = (path) => {
		this.setState({ 
			user: path.user, 
			contacts: path.buddyList.length !== 0 ? path.buddyList[0].friends : [],
			search: path.buddyList.length !== 0 ? path.buddyList[0].friends : [],
			requests: path.buddyList.length !== 0 ? path.buddyList[0].requests : [],
			sentRequests: path.buddyList.length !== 0 ? path.buddyList[0].sentRequests : [],
			loginClasses: "login login-show" 
		});
		if(this.state.currentSearch !== '') this.handleSearch(this.state.currentSearch);
		setTimeout(() => { 
			this.setState({ loginClasses: "login login-show login-hide" }) 
			if(this.loader !== null) {
				this.loader.classList.add('app-loader-hidden')
				setTimeout(() => { this.loader.remove() }, 800);
			}
		}, 600);
		setTimeout(() => { this.setState({ loggedIn: true }) }, 1100);
	}

	toggleBurger = () => {
		if(!this.state.friendToggle) this.toggleFriends();
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
  	if(!this.state.burgerToggle) this.toggleBurger();
    this.setState((prevState, prevProps) => {
      return {
      	friendToggle : !prevState.friendToggle,
        friendListClasses: prevState.friendListClasses === "friend-list" ?
        										"friend-list friend-list-show" :
        										"friend-list"
      }
    });
  }

  handleSearch = (val) => {
  	if(val !== '') {
  		const results = [];
	    for(let i = 0; i < this.props.users.length; i++) {
	      const friend = this.props.users[i].name.toLowerCase();
	      if(friend.indexOf(val.toLowerCase()) !== -1 && friend !== this.state.user.name) {
	        results.push(this.props.users[i]);
	      }
	    }
	    this.setState({ search: results, currentSearch: val });
  	} else {
  		this.setState({search: this.state.contacts});
  	}
  }

  closeChat = (e) => {
  	const i = e.target.dataset.index;
  	const cc = this.state.currentChats;
  	const ns = update(cc, {$splice: [[[i], 1]]});
  	this.setState({currentChats: ns});
  }

  openChat = (name, image) => {
  	const cc = this.state.currentChats;
  	let exists = false;
  	for(let i = 0; i<cc.length; i++) {
  		if(name === cc[i].name) {
  			exists = true;
  			break;
  		}
  	}
  	if(!exists) {
  		Meteor.call('convo.create', name, image, (error, result) => {
  			if(error) {
  				console.log(error);
  			} else {
  				const ns = update(cc, {$push: [{name: name, image: image}]});
  				this.setState({currentChats: ns});
  			}
  		});
  	}
  	this.toggleFriends();
  }

  handleNewImage = (img) => {
  	const user = this.state.user;
  	const newTempImage = update(user, {image: {$set: img}});
  	this.setState({user: newTempImage});
  }

	render = () => {
		return(
			<section
				className="App" 
				style={{height: window.innerHeight}}>

				{
					!this.state.loggedIn &&
					<Login
						classes={this.state.loginClasses} />
				}

				<Header
					burgerStuff={this.state.burgerClasses}
					burger={this.toggleBurger}
					friends={this.toggleFriends}
					messages={this.props.messages}
					user={this.state.user} />

				<Dashboard
					user={this.state.user}
					userId={this.props.id}
					height={this.state.height}
					width={this.state.width}
					loggedIn={this.state.loggedIn} />

				{
					this.state.loggedIn &&
					<FriendList
						user={this.props.user}
						classes={this.state.friendListClasses}
						search={this.state.search}
						contacts={this.state.contacts}
						requests={this.state.requests}
						sentRequests={this.state.sentRequests}
						handleSearch={this.handleSearch}
						openChat={this.openChat}
						messages={this.props.messages}
						user={this.state.user} />
				}

				{
					this.state.loggedIn &&
					<Menu
						classes={this.state.menuClasses}
						user={this.state.user}
						handleNewImage={this.handleNewImage} />
				}

				{
					this.state.loggedIn &&
					this.state.width < 957 ?
					this.state.currentChats.length > 0 &&
					 <Chatbox
							index={this.state.currentChats.length - 1}
							with={this.state.currentChats[this.state.currentChats.length - 1]}
							left={0}
							width={this.state.width}
							closeChat={this.closeChat}
							messages={this.props.messages}
							user={this.state.user} />	
					: this.state.loggedIn &&
						this.state.currentChats.map((chat, i) => {
						return <Chatbox
											index={i}
											key={i}
											with={chat}
											left={i}
											width={this.state.currentChats.length}
											wwidth={this.state.width}
											closeChat={this.closeChat}
											messages={this.props.messages}
											user={this.state.user} />	
					})
				}

			</section>
		);
	}
}