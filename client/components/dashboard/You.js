import React, { Component } from 'react';

export default class You extends Component {
  constructor(props) {
  	super(props);
  }

  componentDidMount(){
    document.getElementById('you').onloadedmetadata = function(e) {
      document.getElementById('you').play();
    };
  }

  render() {
    return (
    	<video 
        autoPlay
    		height={this.props.height - 50} 
    		width={this.props.width}
        ref="you"
        id="you"></video>
    );
  }
}
