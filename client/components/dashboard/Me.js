import React, { Component } from 'react';

export default class Me extends Component {
	constructor(props){
		super(props);
		this.state = {

		}
	}
	render = () => {
		return (
			<video
				id="me" 
    		height="100" 
    		width="100"></video>
		);
	}
}