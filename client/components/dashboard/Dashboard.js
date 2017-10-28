import React, { Component } from 'react';
import You from './You';
import Me from './Me';

export default class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			meUrl: null
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.id !== null && nextProps.id !== undefined) {
			if(this.stream === undefined || this.steam === null && nextProps.id !== this.props.id) this.getLocalStream();
		} else {
			if(this.stream !== undefined && this.stream !== null) {
				this.stream.getVideoTracks()[0].stop();
			}
		}
	}

	getLocalStream(){
		if (navigator.mediaDevices === undefined) navigator.mediaDevices = {};
		if (navigator.mediaDevices.getUserMedia === undefined) {
		  navigator.mediaDevices.getUserMedia = function(constraints) {
				const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		    if (!getUserMedia) {
		      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		    }
		    return new Promise(function(resolve, reject) {
		      getUserMedia.call(navigator, constraints, resolve, reject);
		    });
		  }
		}
		const c  = { 
			audio: false, 
			video: { frameRate: { ideal: 10, max: 15 }, facingMode: "user"
				// width: 100,
				// height: 130
				// facingMode: (front? "user" : "environment") 
			} 
		};
		navigator.mediaDevices.getUserMedia(c)
			.then((stream) => {
			  this.onInitConnect(stream);
			  console.log(stream.getVideoTracks());
			})
			.catch((err) => {
				console.log(err);
			  this.onFailConnect();
			});
		this.pc = new RTCPeerConnection(null);
		console.log(this.pc);
	}

	onInitConnect = (stream) => {
		const me = document.querySelector('#me');
		const you = document.querySelector('#you');
	  if ("srcObject" in me) {
	    me.srcObject = stream;
	    you.srcObject = stream;
	  } else if(URL in window) {
	    me.src = window.URL.createObjectURL(stream);
	    you.src = window.URL.createObjectURL(stream);
	  } else {
	  	me.src = window.webkitURL.createObjectURL(stream);
	    you.src = window.webkitURL.createObjectURL(stream);
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