import React, { Component } from 'react';
import update from 'immutability-helper';

export default class Chatbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
      classes: "chatbox",
			me: 'Alex Figliolia',
			currentChat: 'Steve Figliolia',
			messages: [
				{ to: 'Alex Figliolia', from: 'Steve Figliolia', text: 'hello', date: new Date() },
				{ to: 'Steve Figliolia', from: 'Alex Figliolia', text: 'hello', date: new Date() }
			],
      width: 300
		}
	}

  componentDidMount() {
    this.setState({width: this.refs.mc.clientWidth});
    console.log(this);
  }

  handleEnter = (e) => {
    if(e.which === 13) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage = () => {
    if(this.refs.m.value !== "") {
      this.refs.send.classList.add('fly');
      setTimeout(() => { this.refs.send.classList.add('return')}, 300);
      setTimeout(() => { this.refs.send.classList.add('came-back')}, 350);
      setTimeout(() => { this.refs.send.classList.remove('fly', 'return', 'came-back')}, 600);
      const m = { to: 'Steve Figliolia', from: 'Alex Figliolia', text: this.refs.m.value, date: new Date()};
      const s = this.state.messages;
      const ns = update(s, {$push: [m]});
      this.setState({ messages: ns }, () => {
        this.refs.mc.scrollTop = this.refs.mc.scrollHeight;
        this.refs.m.value = '';
      });
    }
  }

  hideChat = () => {
    this.setState((prevState, prevProps) => {
      return {
        classes: prevState.classes === "chatbox" ? "chatbox chatbox-hide" : "chatbox"
      }
    });
  }

	render() {
    return (
      <div 
        className={this.state.classes}
        style={{
          left: this.props.width < 100 ? this.props.left * this.state.width + 'px' : this.props.left * this.state.width + 'px',
          width: this.props.wwidth / this.props.width + 'px'
        }}>
      	<div>
      		<div className="with">
            {this.props.with}
            <button
              data-index={this.props.index} 
              onClick={this.props.closeChat}
              className="closer"></button>
            <button
              style={{
                transform: this.state.classes === "chatbox chatbox-hide" ? 
                "rotate(180deg)" : "rotate(0deg)"
              }} 
              onClick={this.hideChat}
              className="hide"></button>
          </div>
      		<div className="messages" ref="mc">
      			{
      				this.state.messages.map((message, i) => {
      					return (
      						<div 
      							className={message.from === this.state.me ? 
      							"message message-mine" : "message message-yours"}
                    key={i}>{message.text}</div>
      					);
      				})
      			}
      		</div>
      		<div className="send-messages">
      			<textarea
              onKeyDown={this.handleEnter}
              ref="m" 
              placeholder="Message"></textarea>
      			<button 
              className="send"
              ref="send"
              onClick={this.sendMessage}>
              <img src="send.svg" alt="send message" />
            </button>
      		</div>
      	</div>
      </div>
    );
	}
}
