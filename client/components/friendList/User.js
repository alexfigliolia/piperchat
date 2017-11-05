import React, { Component } from 'react';

export default class User extends Component {

	componentWillReceiveProps(nextProps) {
		if(nextProps !== this.props) {
			const al = document.getElementsByClassName('action-loading');
			Array.from(al).forEach(el => {
				el.classList.remove('action-loading');
			});
		}
	}

  sendRequest = (e) => {
  	Meteor.call('user.sendRequest', this.props.id, (error, result) => {
  		if(error) console.log(error);
  	});
  }

  acceptRequest = (e) => {
  	e.target.classList.add('action-loading');
  	Meteor.call('user.acceptRequest', this.props.id, (error, result) => {
  		if(error) { console.log(error) }
  	});
  }

  denyRequest = (e) => {
  	e.target.classList.add('action-loading');
  	Meteor.call('user.denyRequest', this.props.id, (error, result) => {
  		if(error) { console.log(error) }
  	});
  }

  render = () => {
    return (
      <div 
    		className="user">
				<div>
					<img src={this.props.image} alt="friend" />
					<h3>{this.props.name}</h3>
					{
						this.props.isRequest ?
						<div className="accept-deny">
							<button 
								className="deny"
								onClick={this.denyRequest}></button>
							<button 
								className="accept"
								onClick={this.acceptRequest}></button>
						</div>
						:
						<div className="add-new">
							{
								!this.props.sentRequest ?
								<button onClick={this.sendRequest}></button>
								:
								<div className="r-pending"></div>
							}
						</div>
					}
				</div>
			</div>
    );
  }
}
