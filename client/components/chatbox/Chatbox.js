import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import update from 'immutability-helper';

export default class Chatbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
      classes: "chatbox",
			me: 'Alex Figliolia',
			currentChat: 'Steve Figliolia',
      width: 300
		}
	}

  componentDidMount = () => {
    this.setState({width: this.refs.mc.clientWidth});
    this.handleScroll();
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.width !== this.props.width) {
      this.setState({width: this.refs.mc.clientWidth});
    }
    if(nextProps.messages.length !== this.props.messages.length) this.handleScroll();
  }

  getWidth = () => {
    if(this.refs.mc) return this.refs.mc.clientWidth;
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
      Meteor.call('message.send', this.props.with._id, this.refs.m.value, (error, result) => {
        if(error) {
          console.log(error);
        } else {
          this.refs.m.value = '';
        }
      });
    }
  }

  hideChat = () => {
    this.setState((prevState, prevProps) => {
      return { classes: prevState.classes === "chatbox" ? "chatbox chatbox-hide" : "chatbox" }
    });
  }


  handleScroll = () => {
    setTimeout(() => { this.refs.mc.scrollTop = this.refs.mc.scrollHeight }, 50);
  }

	render = () => {
    const l = this.getWidth() + 1;
    return (
      <div 
        className={this.state.classes}
        style={{
          left: this.props.width < 100 ? l * this.props.left  + 'px' : this.props.left * this.state.width + 'px',
          width: this.props.wwidth / this.props.width + 'px'
        }}>
      	<div>
      		<div className="with">
            {this.props.with.name}
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
      		<div className="messages" ref="mc" id="mc">
      			<div>
              {
                this.props.messages.map((message, i) => {
                  if(message.to.name === this.props.user.name && message.from.name === this.props.with.name ||
                    message.from.name === this.props.user.name && message.to.name === this.props.with.name)
                  return (
                    <div 
                      className={message.from.name === this.props.user.name ? 
                      "message message-mine" : "message message-yours"}
                      key={i}>{message.text}</div>
                  );
                })
              }   
            </div>
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
