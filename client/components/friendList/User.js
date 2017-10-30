import React, { Component } from 'react';

export default class User extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		sentRequest: null
  	}
  }

  sendRequest = (e) => {
  	Meteor.call('user.sendRequest', e.target.dataset.name, e.target.dataset.image, (error, result) => {
  		if(error) {
  			console.log(error);
  		} else {
  			this.setState({ sentRequest: true });
  		}
  	});
  }

  acceptRequest = (e) => {
  	Meteor.call('user.acceptRequest', e.target.dataset.name, e.target.dataset.image, (error, result) => {
  		if(error) console.log(error);
  	});
  }

  render() {
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
								onClick={this.acceptRequest}
								data-name={this.props.name}
								data-image={this.props.image}></button>
							<button 
								className="accept"
								onClick={this.acceptRequest}
								data-name={this.props.name}
								data-image={this.props.image}></button>
						</div>
						:
						<div className="add-new">
							{
								this.state.sentRequest === null ?
								<button 
									data-name={this.props.name}
									data-image={this.props.image}
									onClick={this.sendRequest}></button>
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
