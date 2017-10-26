import React, { Component, PropTypes } from 'react';

export default class Chatbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			me: 'Alex',
			currentChat: 'steve',
			messages: [
				{ to: 'Alex', from: 'Steve', text: 'hello', date: new Date() },
				{ to: 'Steve', from: 'Alex', text: 'hello', date: new Date() }
			]
		}
	}

	render() {
    return (
      <div className="chatbox chatbox-hide">
      	<div>
      		<div className="with">Some dude</div>
      		<div className="messages">
      			{
      				this.state.messages.map((message, i) => {
      					return (
      						<div 
      							className={message.from === this.state.me ? 
      							"message message-mine" : "message message-yours"}>{message.text}</div>
      					);
      				})
      			}
      		</div>
      		<div className="send-messages">
      			<textarea placeholder="Message"></textarea>
      			<button className="send"></button>
      		</div>
      	</div>
      </div>
    );
	}
}
