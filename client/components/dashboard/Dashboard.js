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
		if(nextProps.userId !== null && nextProps.userId !== undefined && this.stream === null) {
			this.getLocalStream();
		}
		if(this.stream !== undefined && this.stream !== null && nextProps.userId === null) {
			this.stream.getTracks()[0].stop();
			this.stream = null;
		}
	}

	getLocalStream(){
		if (navigator.mediaDevices === undefined) {
		  navigator.mediaDevices = {};
		}
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
		const c  = { 
			audio: false, 
			video: true
				// width: 100,
				// height: 130
				// facingMode: (front? "user" : "environment") 
		};
		navigator.mediaDevices.getUserMedia(c)
			.then((stream) => {
			  this.onInitConnect(stream);
			  // console.log(stream.getVideoTracks());
			})
			.catch((err) => {
				console.log(err);
			  this.onFailConnect();
			});
		this.pc = new RTCPeerConnection(null);
		// console.log(this.pc);

		// navigator.mediaDevices.getUserMedia({ audio: true, video: true })
		// 	.then(function(stream) {
		// 	  var video = document.querySelector('video');
		// 	  // Older browsers may not have srcObject
		// 	  if ("srcObject" in video) {
		// 	    video.srcObject = stream;
		// 	  } else {
		// 	    // Avoid using this in new browsers, as it is going away.
		// 	    video.src = window.URL.createObjectURL(stream);
		// 	  }
		// 	  video.onloadedmetadata = function(e) {
		// 	    video.play();
		// 	  };
		// 	})
		// 	.catch(function(err) {
		// 	  console.log(err.name + ": " + err.message);
		// 	});
	}

	onInitConnect = (stream) => {
		const me = document.querySelector('#me');
		const you = document.querySelector('#you');
	  if ("srcObject" in me) {
	    me.srcObject = stream;
	    you.srcObject = stream;
	    console.log('connected with srcObject');
	  } 
	  else 
	  	// if(URL in window) 
	  {
	    me.src = window.URL.createObjectURL(stream);
	    you.src = window.URL.createObjectURL(stream);
	    console.log('connected with window.URL');
	  } 
	  // else {
	  // 	me.src = window.webkitURL.createObjectURL(stream);
	  //   you.src = window.webkitURL.createObjectURL(stream);
	  //   console.log('connected with src');
	  // }
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