import React, { Component } from 'react';

export default class Friend extends Component {
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
						<button
							data-image={this.props.image === undefined ? null : this.props.image}
							data-with={this.props.name} 
							onClick={this.props.openChat}></button>
						<button 
							onClick={this.props.call}
							data-image={this.props.image === undefined ? null : this.props.image}
							data-with={this.props.name}></button>
					</div>
				</div>
			</div>
    );
  }
}
