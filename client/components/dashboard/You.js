import React, { Component } from 'react';

export default class You extends Component {
  constructor(props) {
  	super(props);
  }

  componentDidMount(){
    this.refs.you.onloadedmetadata = (e) => {
      this.refs.you.play();
    }
  }

  render() {
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
