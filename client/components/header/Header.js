import React, { Component } from 'react';
import Burger from './Burger.js';

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
    	<header className="header">
    		<div>
    			<button 
            onClick={this.props.friends}
            className="contacts">
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
