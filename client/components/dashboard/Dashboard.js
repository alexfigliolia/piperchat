import React, { Component } from 'react';
import You from './You';
import Me from './Me';

export default class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			meUrl: null
		}
		this.stream = null;
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.userId !== null && nextProps.userId !== undefined && this.state.meUrl === null) {
			this.getLocalStream();
		}
		if(this.state.meUrl !== null && nextProps.userId === null) {
			this.stream.getTracks()[0].stop();
			this.stream = null;
			this.setState({ meUrl: null});
			console.log('i should disconnect');
		}
	}

	getLocalStream(){
		if (navigator.mediaDevices === undefined) navigator.mediaDevices = {};
		if (navigator.mediaDevices.getUserMedia === undefined) {
		  navigator.mediaDevices.getUserMedia = function(constraints) {
		    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		    if (!getUserMedia) {
		      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		    }
		    return new Promise(function(resolve, reject) {
		      getUserMedia.call(navigator, constraints, resolve, reject);
		    });
		  }
		}
		const c  = { audio: false, video: true };
		navigator.mediaDevices.getUserMedia(c)
			.then((stream) => {
			  this.onInitConnect(stream);
			})
			.catch((err) => {
				console.log(err);
			  this.onFailConnect();
			});
		this.pc = new RTCPeerConnection(null);
	}

	onInitConnect = (stream) => {
		const me = document.querySelector('#me');
		const you = document.querySelector('#you');
	  if ("srcObject" in me) {
	    me.srcObject = stream;
	    you.srcObject = stream;
	  } else {
	    me.src = window.URL.createObjectURL(stream);
	    you.src = window.URL.createObjectURL(stream);
	  }
    this.setState({ meUrl: stream});
    this.stream = stream;
	}

	onFailConnect = () => console.log('fail');

	touchStart = (e) => e.preventDefault();

	render = () => {
		return (
			<section 
				className="dashboard"
				onTouchStart={this.touchStart}>
				<div>
					<You
						ref="you"
						height={this.props.height}
						width={this.props.width} />
					<Me 
						style={{background: "green"}} 
						src={this.state.meUrl} />
				</div>
			</section>
		);
	}
}