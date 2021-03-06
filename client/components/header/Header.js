import React, { Component } from 'react';
import { Burger } from './Burger.js';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasNew: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.messages.length !== 0 && nextProps.messages.length !== 0) {
      if(nextProps.messages.length !== this.props.messages.length && 
      nextProps.messages[nextProps.messages.length - 1].from.name !== this.props.user.name) {
        this.setState({ hasNew: true });
      }
    }
    if(nextProps.messages.length !== 0 && this.props.messages.length !== 0) {
      if(nextProps.messages.length !== this.props.messages.length && 
      nextProps.messages[nextProps.messages.length - 1].from.name === this.props.user.name &&
      nextProps.messages[nextProps.messages.length - 1].to.name === nextProps.messages[nextProps.messages.length - 2].from.name) 
      {
        this.setState({hasNew: false});
      }
    }
  }

  seeBuddies = () => {
    this.setState({ hasNew: false });
    this.props.friends();
  }

  render = () => {
    return (
    	<header className={this.props.classes}>
    		<div>
    			<button 
            onClick={this.seeBuddies}
            className={this.state.hasNew ? "contacts has-new" : "contacts"}>
          </button>
    			<div className="logo"></div>
    			<Burger
    				classes={this.props.burgerStuff} 
            burger={this.props.burger} />
    		</div>
    	</header>
    );
  }
}
