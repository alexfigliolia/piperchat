import React, { Component } from 'react';
import You from './You';
import Me from './Me';

export default class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {

		}
	}
	render = () => {
		return (
			<section className="dashboard">
				<div>
					<You
						height={this.props.height}
						width={this.props.width} />
					<Me 
						style={{background: "green"}} />
				</div>
			</section>
		);
	}
}