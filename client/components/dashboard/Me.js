import React, { Component } from 'react';

export default class Me extends Component {
	constructor(props){
		super(props);
		this.state = {
			top: window.innerHeight - 150,
			left: window.innerWidth - 120
		}
	}

	componentDidMount(){
		document.getElementById('me').onloadedmetadata = function(e) {
	    document.getElementById('me').play();
	  };
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
		window.addEventListener('mousemove', this.moveMe, true);
	}

	mouseUp = (e) => {
		window.removeEventListener('mousemove', this.moveMe, true);
		this.setState({top: e.clientY - 70, left: e.clientX - 50});
	}

	touchStart = (e) => {
		window.addEventListener('touchmove', this.touchMe, true);
	}

	touchEnd = (e) => {
		window.removeEventListener('touchmove', this.touchMe, true);
		// this.setState({
		// 	top: e.touches[0].clientY - 70, 
		// 	left: e.touches[0].clientX - 50
		// });
	}

	render = () => {
		const hh = window.innerWidth < 670 ? 50 : 80;
		let x = this.state.left < 0 ? 0 : this.state.left;
		let y = this.state.top < hh ? hh : this.state.top;
		x = this.state.left > window.innerWidth - 100 ? window.innerWidth - 100 : x;
		y = this.state.top > window.innerHeight - hh ? window.innerHeight - 140 : y;
		return (
			<video
				onMouseDown={this.mouseDown}
				onMouseUp={this.mouseUp}
				onTouchStart={this.touchStart}
				onTouchEnd={this.touchEnd}
				id="me" 
				ref="me"
    		height="130" 
    		width="100"
    		autoPlay
    		playsInline
    		style={{
    			top: `${y}px`,
    			left: `${x}px`
    		}}></video>
		);
	}
}