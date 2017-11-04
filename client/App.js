import React, { Component } from 'react';
import update from 'immutability-helper';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';
import FriendList from './components/friendList/FriendList';
import Menu from './components/menu/Menu';
import Chatbox from './components/chatbox/Chatbox';
import './peer';

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
      callingClasses: "calling",
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
		this.stream = null;
		this.incomingCall = null;
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

	//SHOW LOGIN IF APP CANNOT IDENTIFY USER
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

	//ALLOW ACCESS TO APP IF THE USER IS RECOGNIZED
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

	//OPEN MENU
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

  //OPEN BUDDY LIST
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

  //SEARCH FOR FRIENDS AND USERS
  handleSearch = (val) => {
  	this.setState({ currentSearch: val });
  	if(val !== '') {
  		const results = [];
	    for(let i = 0; i < this.props.users.length; i++) {
	      const friend = this.props.users[i].name.toLowerCase();
	      if(friend.indexOf(val.toLowerCase()) !== -1 && friend !== this.state.user.name) {
	        results.push(this.props.users[i]);
	      }
	    }
	    this.setState({ search: results });
  	} else {
  		this.setState({search: this.state.contacts});
  	}
  }

  //CLOSE A CHAT
  closeChat = (e) => {
  	const i = e.target.dataset.index;
  	const cc = this.state.currentChats;
  	const ns = update(cc, {$splice: [[[i], 1]]});
  	this.setState({currentChats: ns});
  }

  //OPEN A CHAT
  openChat = (name, image, id) => {
  	const cc = this.state.currentChats;
  	let exists = false;
  	for(let i = 0; i<cc.length; i++) {
  		if(name === cc[i].name) {
  			exists = true;
  			break;
  		}
  	}
  	if(!exists) {
  		Meteor.call('convo.create', id, (error, result) => {
  			if(error) {
  				console.log(error);
  			} else {
  				const ns = update(cc, {$push: [{name: name, image: image, _id: id}]});
  				this.setState({currentChats: ns});
  			}
  		});
  	}
  	this.toggleFriends();
  }

  //UPLOAD NEW PROFILE IMAGE
  handleNewImage = (img) => {
  	const user = this.state.user;
  	const newTempImage = update(user, {image: {$set: img}});
  	this.setState({user: newTempImage});
  }

  getLocalStream = () => {
		if (navigator.mediaDevices === undefined) navigator.mediaDevices = {};
		if (navigator.mediaDevices.getUserMedia === undefined) {
		  navigator.mediaDevices.getUserMedia = function(constraints) {
		    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		    if (!getUserMedia) {
		      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		    }
		    return new Promise(function(resolve, reject) {
		      getUserMedia.call(navigator, constraints, resolve, reject);
		    });
		  }
		}
		const c  = { audio: false, video: true };
		navigator.mediaDevices.getUserMedia(c)
			.then((stream) => {
			  this.onInitConnect(stream);
			  rs = stream;
			})
			.catch((err) => {
				console.log(err);
				this.onFailConnect();
			});
		// this.pc = new RTCPeerConnection(null);
	}

	onInitConnect = (stream) => {
		const me = document.querySelector('#me');
		const you = document.querySelector('#you');
		const url = window.URL || window.webkitURL;
		if ("srcObject" in me) {
			me.srcObject = stream;
			you.srcObject = stream;
		} else {
			me.src = url.createObjectURL(stream);
			you.src = url.createObjectURL(stream);
		}
		this.stream = stream;
	}

	onFailConnect = () => console.log('fail');

  initPeer = () => {
		window.peer = new Peer({
			host: 'piper-server.herokuapp.com', 
			port: '', 
			secure: true,
			path:'/',
			debug: 3,
		  config: {'iceServers': [
		    { url: 'stun:stun.l.google.com:19302' },
		    { url: 'stun:stun1.l.google.com:19302' },
		  ]}
		});


		peer.on('open', () => {
		  peerID = peer.id;
		  Meteor.call('user.updatePeerID', peer.id, (error, result) => {
		  	if(error) console.log(error);
		  })
		});

		//When user is receiving a video call request
		peer.on('call', (incomingCall) => {
			console.log('incoming call');
			this.setState({ callingClasses: "calling calling-show receiving-call" });
			this.incomingCall = incomingCall;
		});

		peer.on('disconnected', () => {
			this.setState({ callingClasses: 'calling' });
		});
	}

	setCallingScreen = () => {
		console.log('set Calling Screen');
		if(this.incomingCall !== null) {
			this.setState({ callingClasses: "calling calling-show receiving-call received" });
		}
 	}

	acceptCall = () => {
		console.log('accept call');
		this.setState({ callingClasses: "calling calling-show received" });
		window.currentCall = this.incomingCall;
	  this.incomingCall.answer(this.stream);
	  this.incomingCall.on('stream', (remoteStream) => {
	  	console.log('streaming call');
	    window.remoteStream = remoteStream;
	    const you = document.getElementById("you")
	    const url = window.URL || window.webkitURL;
			if ("srcObject" in you) {
				you.srcObject = remoteStream;
			} else {
				you.src = url.createObjectURL(remoteStream);
			}
	  });
	}

  //VIDEO CALL ONE OF YOUR FRIENDS
  call = (name) => {
  	let id;
  	let isOnline = false;
  	this.state.contacts.forEach(contact => {
  		if(contact.name === name) id = contact._id;
  		this.props.states.forEach(onlineContact => {
  			if(id === onlineContact.userId) isOnline = true;
  		});
  	});
  	if(isOnline) {
  		Meteor.call('user.getPeerId', id, (error, result) => {
  			if(error) {
  				console.log(error);
  			} else {
  				this.setUpCall(result);
  				this.toggleFriends();
			  	this.setState({ callingClasses: "calling calling-show" });
  			}
  		});
  	}
  }

  setUpCall = (peerId) => {
	  let outgoingCall = peer.call(peerId, this.stream);
	  console.log(outgoingCall);
	  window.currentCall = outgoingCall;
	  console.log('making the call');
	  outgoingCall.on('stream', (remoteStream) => {
	  	console.log('receiving remote stream');
	    window.remoteStream = remoteStream;
	    const you = document.getElementById("you")
	    const url = window.URL || window.webkitURL;
			if ("srcObject" in you) {
				you.srcObject = remoteStream;
			} else {
				you.src = url.createObjectURL(remoteStream);
			}
			console.log('set remote stream');
			this.setState({ callingClasses: "calling calling-show received" });
	  });
	}

  //END A CALL 
  endCall = (e) => {
  	this.setState({ callingClasses: "calling" });
  	this.incomingCall = null;
  	this.onInitConnect(this.stream);
  	if(window.currentCall) {
  		window.currentCall.close();
  	}
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
					loggedIn={this.state.loggedIn}
					classes={this.state.callingClasses}
					endCall={this.endCall}
					initPeer={this.initPeer}
					getLocalStream={this.getLocalStream}
					stream={this.stream}
					acceptCall={this.acceptCall}
					setCallingScreen={this.setCallingScreen} />

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
						user={this.state.user}
						call={this.call}
						states={this.props.states} />
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