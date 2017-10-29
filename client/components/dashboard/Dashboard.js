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
		this.support = navigator.mediaDevices.getUserMedia || navigator.getUserMedia ? true : false;
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
						this.support &&
						<You
							ref="you"
							height={this.props.height}
							width={this.props.width} />
					}

					{
						this.props.loggedIn &&
						this.support &&
						<Me 
							style={{background: "green"}} 
							src={this.state.meUrl} />
					}

					{
						this.props.loggedIn &&
						!this.support &&
						<div>
							<h2>We at Piper Chat are very sorry</h2>
							<h3>Your browser does not support video chat</h3>
							<p>Please try Google Chrome for desktop, Safari for iOS, or Chrome for Android</p>
						</div>
					}
					
				</div>
			</section>
		);
	}
}