import React from 'react';
import You from './You';
import Me from './Me';

export const Dashboard = (props) => {
	return (
		<section className="dashboard">
			<div>
				{
					props.loggedIn &&
					<You
						height={props.height}
						width={props.width}
						setCallingScreen={props.setCallingScreen} />
				}
				{
					props.loggedIn &&
					<Me 
						style={{background: "green"}} 
						initPeer={props.initPeer}
						getLocalStream={props.getLocalStream}
						localStream={props.stream} />
				}
			</div>
			<div className={props.classes} id="csc">
				<div className="loader-pic"></div>
				<div className="answer-deny">
					<button
						onClick={props.endCall}
						className="end-call"></button>
					<button
						onClick={props.acceptCall}
						className="answer-call"></button>
				</div>
			</div>
		</section>
	);
}