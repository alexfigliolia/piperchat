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

	componentDidMount(){
		const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		const v = {
			video: {
				mandatory: {
					minWidth: '100px',
					minHeight: '130px'
				}
			},
			audio: true
		};
		getUserMedia.call(navigator, v, this.onInitConnect, this.onFailConnect);
		this.pc = new RTCPeerConnection(null);
		console.log(this.pc);
	}

	onInitConnect = (stream) => {
		if (window.URL) {
    	this.setState({ meUrl: window.URL.createObjectURL(stream)});
    } else if(window.webkitURL){	
    	this.setState({ meUrl: window.webkitURL.createObjectURL(stream)});
    } else{
    	this.setState({ meUrl: stream});
    }
    this.stream = stream;
	}

	onFailConnect = () => {
		console.log('fail');
	}

	touchStart = (e) => {
		e.preventDefault();
	}

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