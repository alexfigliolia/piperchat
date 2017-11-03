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
						<You
							ref="you"
							height={this.props.height}
							width={this.props.width}
							setCallingScreen={this.props.setCallingScreen} />
					}

					{
						this.props.loggedIn &&
						<Me 
							style={{background: "green"}} 
							src={this.state.meUrl}
							initPeer={this.props.initPeer}
							getLocalStream={this.props.getLocalStream}
							localStream={this.props.stream} />
					}
				</div>
				<div className={this.props.classes} id="csc">
					<div className="loader-pic"></div>
					<div className="answer-deny">
						<button
							onClick={this.props.endCall}
							className="end-call"></button>
						<button
							onClick={this.props.acceptCall}
							className="answer-call"></button>
					</div>
				</div>
			</section>
		);
	}
}