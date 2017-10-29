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

	touchStart = (e) => e.preventDefault();

	render = () => {
		return (
			<section 
				className="dashboard"
				onTouchStart={this.touchStart}>
				<div>
					{
						this.props.loggedIn &&
						!navigator.mediaDevices.getUserMedia && 
						!navigator.getUserMedia &&
						<div
							style={{
								position: 'absolute',
								top: '80px',
								left: '0px',
								width: '100%',
								zIndex: '39'
							}}>
							<h2>We're very sorry that your browser will not support Video Chat</h2>
							<h3>Please try again using Google Chrome for desktop, Safari on ios, or Chrome for Android</h3>
						</div>
					}
					{
						this.props.loggedIn &&
						<You
							ref="you"
							height={this.props.height}
							width={this.props.width} />
					}

					{
						this.props.loggedIn &&
						<Me 
							style={{background: "green"}} 
							src={this.state.meUrl} />
					}
					
				</div>
			</section>
		);
	}
}