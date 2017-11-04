import React, { Component } from 'react';
import update from 'immutability-helper';
import Friend from './Friend';
import User from './User';

export default class FriendList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasNew: []
		}
	}

	handleSearch = (e) => {
		this.props.handleSearch(e.target.value);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps !== this.props && this.props.classes === "friend-list") {
			this.refs.list.scrollTop = 0;
		}
		if(this.props.messages.length !== 0 && nextProps.messages.length !== 0) {
      if(nextProps.messages.length !== this.props.messages.length && 
      nextProps.messages[nextProps.messages.length - 1].from.name !== this.props.user.name) {
      	const hasNew = this.state.hasNew;
      	const ns = update(hasNew, {$push : [nextProps.messages[nextProps.messages.length - 1].from.name]});
        this.setState({hasNew: ns});
      }
    }
    if(nextProps.messages.length !== 0 && this.props.messages.length !== 0) {
    	if(nextProps.messages.length !== this.props.messages.length && 
      nextProps.messages[nextProps.messages.length - 1].from.name === this.props.user.name &&
      nextProps.messages[nextProps.messages.length - 1].to.name === nextProps.messages[nextProps.messages.length - 2].from.name) 
      {
      	const hasNew = this.state.hasNew;
      	const index = hasNew.indexOf(nextProps.messages[nextProps.messages.length - 2].from.name)
      	const ns = update(hasNew, {$splice : [[index, 1]]});
        this.setState({hasNew: ns});
      }
    }
	}

	checkInContacts = (name) => {
		let exists = false;
		for(let i = 0; i<this.props.contacts.length; i++) {
			if(this.props.contacts[i].name === name) { 
				exists = true;
				break;
			}
		}
		return exists;
	}

	checkInReqs = (name) => {
		let exists = false;
		for(let i = 0; i<this.props.sentRequests.length; i++) {
			if(this.props.sentRequests[i].name === name){
				exists = true;
				break;
			}
		}
		return exists;
	}

	openChat = (name, image, id) => {
  	const s = this.state.hasNew;
  	const i = s.indexOf(name);
  	const ns = update(s, {$splice: [[i, 1]]});
  	this.setState({hasNew: ns});
		this.props.openChat(name, image, id);
	}

	checkOnline = (id) => {
		let online = false;
		for(let i = 0; i<this.props.states.length; i++) {
			if(id === this.props.states[i].userId) {
				online = true;
				break;
			}
		}
		return online;
	}

	render = () => {
		return (
			<section className={this.props.classes}>
				<div>
					<div className="list-header">
						<div className="piper">
							<div className="icon"></div>
							<h2>Friends</h2>
						</div>
						<div className="add-friend">
							<input 
								type="search" 
								placeholder="Find Someone"
								onChange={this.handleSearch} />
						</div>
					</div>
					<div ref="list" className="list">
						{
							this.props.requests.map((user, i) => {
								return (
									<User
										key={i}
										name={user.name}
										image={user.image}
										id={user._id}
										isRequest={true}
										sentRequest={false} />
								);
							})
						}
						{
							this.props.sentRequests.map((user, i) => {
								return (
									<User
										key={i}
										name={user.name}
										image={user.image}
										id={user._id}
										sentRequest={true} />
								);
							})
						}
						{
							this.props.search.map((dude, i) => {
								if(!this.checkInContacts(dude.name) && 
									 !this.checkInReqs(dude.name) && 
									 dude.name !== this.props.user.name) {
									return (
										<User
											key={i}
											name={dude.name}
											image={dude.image}
											id={dude._id}
											isRequest={false}
											sentRequest={false} />
									);
								} else if(dude.name !== this.props.user.name && !this.checkInReqs(dude.name)) {
									return (
										<Friend 
											key={i}
											name={dude.name}
											image={dude.image}
											id={dude._id}
											online={dude.online}
											hasNew={this.state.hasNew.indexOf(dude.name) !== -1}
											openChat={this.openChat}
											call={this.props.call}
											online={this.checkOnline(dude._id)} />
									);
								}
							})
						}
					</div>
				</div>
			</section>
		);
	}
}