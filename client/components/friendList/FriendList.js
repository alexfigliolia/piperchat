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
        console.log(nextProps.messages[nextProps.messages.length - 1].from.name);
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

	openChat = (e) => {
		const name = e.target.dataset.with;
  	const image = e.target.dataset.image;
  	const s = this.state.hasNew;
  	const i = s.indexOf(name);
  	const ns = update(s, {$splice: [[i, 1]]});
  	this.setState({hasNew: ns});
		this.props.openChat(name, image);
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
											isRequest={false}
											sentRequest={false} />
									);
								} else if(dude.name !== this.props.user.name && !this.checkInReqs(dude.name)) {
									return (
										<Friend 
											key={i}
											name={dude.name}
											image={dude.image}
											online={dude.online}
											hasNew={this.state.hasNew.indexOf(dude.name) !== -1}
											openChat={this.openChat} />
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