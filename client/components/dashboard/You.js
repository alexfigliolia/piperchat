import React, { Component } from 'react';

export default class You extends Component {
  
  componentDidMount(){
    this.refs.you.onloadedmetadata = (e) => {
      this.refs.you.play();
      this.props.setCallingScreen();
    }
  }
  
  render = () => {
    return (
    	<video
        autoPlay
    		height={this.props.height - 50} 
    		width={this.props.width}
        ref="you"
        playsInline
        id="you"></video>
    );
  }
}
