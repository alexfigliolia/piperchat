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
		const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		let cameraStream;
		const v = {
			video: {
				mandatory: {
					minWidth: 100,
					minHeight: 130
				}
			},
			audio: true
		};
		getUserMedia.call(navigator, v, this.onInitConnect, this.onFailConnect);
		// navigator.getUserMedia(v, this.onInitConnect, this.onFailConnect);
		this.pc = new RTCPeerConnection(null);
		console.log(this.pc);
	}

	onInitConnect = (stream) => {
		if (window.webkitURL || window.URL) {
			const URL = window.webkitURL || window.URL;
    	this.refs.me.src = window.URL.createObjectURL(stream);
    } else {
    	this.refs.me.src = stream;
    }
	}

	onFailConnect = () => {
		console.log('fail');
	}

	moveMe = (e) => {
		console.log(e.clientY + " - " + e.clientX);
		this.setState({top: e.clientY - 70, left: e.clientX - 50});
	}

	touchMe = (e) => {
		console.log(e.touches[0].clientY + " - " + e.touches[0].clientX);
		this.setState({
			top: e.touches[0].clientY - 70, 
			left: e.touches[0].clientX - 50
		});
	}

	mouseDown = (e) => {
		console.log('holding');
		window.addEventListener('mousemove', this.moveMe, true);
	}

	mouseUp = (e) => {
		console.log('released');
		window.removeEventListener('mousemove', this.moveMe, true);
		this.setState({top: e.clientY - 70, left: e.clientX - 50});
	}

	touchStart = (e) => {
		console.log('holding');
		window.addEventListener('touchmove', this.touchMe, true);
	}

	touchEnd = (e) => {
		console.log('holding');
		window.removeEventListener('touchmove', this.touchMe, true);
		this.setState({
			top: e.touches[0].clientY - 70, 
			left: e.touches[0].clientX - 50
		});
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
    		style={{
    			top: `${y}px`,
    			left: `${x}px`
    		}}></video>
		);
	}
}