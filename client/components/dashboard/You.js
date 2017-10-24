import React, { Component } from 'react';

export default class You extends Component {
  constructor(props) {
  	super(props);
  }

  render() {
    return (
    	<video 
    		height={this.props.height - 50} 
    		width={this.props.width}></video>
    );
  }
}
