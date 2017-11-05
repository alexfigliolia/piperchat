import React, { Component } from 'react';

export default class Friend extends Component {

	openChat = () => {
		const image = this.props.image === undefined ? null : this.props.image;
		this.props.openChat(this.props.name, image, this.props.id);
	}

	call = () => this.props.call(this.props.name);

  render() {
    return (
    	<div 
    		className={this.props.hasNew ? "contact has-new" : "contact"}
    		onClick={this.props.openFriend}>
				<div>
					<img src={this.props.image} alt="friend" />
					<h3>{this.props.name}</h3>
					<div
						className="online"
						style={{
							background: this.props.online ? "#51C68C" : "#A8AEB1"
						}}></div>
				</div>
				<div className="call-message">
					<div>
						<button onClick={this.openChat}></button>
						<button
							style={{
								opacity: this.props.online ? 1 : 0.25
							}} 
							onClick={this.call}></button>
					</div>
				</div>
			</div>
    );
  }
}
