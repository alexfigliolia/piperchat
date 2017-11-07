import React, { Component } from 'react';

export default class Me extends Component {
	constructor(props){
		super(props);
		this.state = {
			top: window.innerHeight - 150,
			left: window.innerWidth - 120,
			height: 130,
			width: 100,
			tD: 0.5
		}
	}

	componentDidMount = () => {
		setTimeout(() => { 
			this.props.getLocalStream();
			this.props.initPeer();
		}, 1000);
		this.refs.me.onloadedmetadata = (e) => {
	    this.refs.me.play();
	    this.setState({ 
	    	height: this.refs.me.videoHeight/3.5, 
	    	width: this.refs.me.videoWidth/3.5,
	    	top: 55,
	    	left: (window.innerWidth - 5) - this.refs.me.videoWidth/3.5
	    });
	  }
	}

	moveMe = (e) => {
		this.setState({top: e.clientY - 70, left: e.clientX - 50});
	}

	touchMe = (e) => {
		this.setState({
			top: e.touches[0].clientY - 70, 
			left: e.touches[0].clientX - 50
		});
	}

	mouseDown = (e) => {
		this.setState({tD: 0});
		window.addEventListener('mousemove', this.moveMe, true);
	}

	mouseUp = (e) => {
		window.removeEventListener('mousemove', this.moveMe, true);
		this.setState({top: e.clientY - 70, left: e.clientX - 50});
	}

	touchStart = (e) => {
		this.setState({tD: 0});
		window.addEventListener('touchmove', this.touchMe, true);
	}

	touchEnd = (e) => {
		window.removeEventListener('touchmove', this.touchMe, true);
	}

	render = () => {
		const hh = window.innerWidth < 670 ? 50 : 80;
		let x = this.state.left < 0 ? 0 : this.state.left;
		let y = this.state.top < hh ? hh : this.state.top;
		x = this.state.left > window.innerWidth - this.state.width ? window.innerWidth - this.state.width : x;
		y = this.state.top > window.innerHeight - this.state.height ? window.innerHeight - this.state.height : y;
		return (
			<video
				onMouseDown={this.mouseDown}
				onMouseUp={this.mouseUp}
				onTouchStart={this.touchStart}
				onTouchEnd={this.touchEnd}
				id="me" 
				ref="me"
    		height={this.state.height}
    		width={this.state.width}
    		autoPlay
    		playsInline
    		muted="true"
    		style={{
    			transition: `all ${this.state.tD}s`,
    			top: `${y}px`,
    			left: `${x}px`
    		}}></video>
		);
	}
}