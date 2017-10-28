import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import Upload from './Upload';

export default class Menu extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			classes: "",
			profClasses: "prof",
			profileClasses: "profile",
			profText: "Profile",
			userName: this.props.user.name
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.user.name !== this.props.user.name) this.setState({ userName: nextProps.user.name});
		if(nextProps.classes === "menu" && this.state.profClasses === "prof prof-flip") {
			this.makeChanges();
			this.setState({ userName: nextProps.user.name });
		}
	}

	logout = () => Meteor.logout();

	onFocus = (e) => e.target.parentNode.classList.add('focus');

	onBlur = (e) => {
		if(e.target.value === "") e.target.parentNode.classList.remove('focus');
	}

	handleChange = (e) => {
		this.setState({ profText: e.target.value === "" ? "Close" : "Save", userName: e.target.value });
	}

	makeChanges = () => {
		this.setState((prevState, prevProps) => {
			if(prevState.profClasses === "prof") {
				this.refs.newName.parentNode.classList.add('focus');
			} else {
				this.refs.newName.parentNode.classList.remove('focus');
			}
			return {
				profClasses: prevState.profClasses === "prof" ? "prof prof-flip" : "prof",
				profileClasses: prevState.profileClasses === "profile" ? "profile profile-show" : "profile",
				profText: prevState.profText === "Profile" ? "Close" : "Profile"
			}
		});
	}

  handleNameChange = () => {
 		if(this.refs.newName.value !== this.props.user.name) {
 			Meteor.call('user.changeName', this.refs.newName.value, (error, result) => {
 				if(error) { console.log(error) } else { this.makeChanges() }
 			});
	  }
  }

	render = () => {
		return (
			<section className={this.props.classes}>
				<div>
					<div className={this.state.profClasses}>
						<div className="image">
							<img src={this.props.user.image} alt="me" />
							<Upload makeChanges={this.makeChanges} />
						</div>
						<h2>{this.props.user.name}</h2>
					</div>
					<div className="options">
						<button 
							onClick={this.state.profText === "Profile" || 
											 this.state.profText === "Close" ? this.makeChanges : this.handleNameChange}
							style={{
								color: this.state.profText === "Profile" ? "#828282" : "#fff",
								background: this.state.profText === "Profile" ? "none" : "#139A8F"
							}}>{this.state.profText}</button>
						<button>Privacy</button>
						<button>Settings</button>
					</div>
					<button onClick={this.logout}>Log out</button>
					<div className={this.state.profileClasses}>
						<div className="input">
							<label htmlFor="pn">Name</label>
							<input
								onChange={this.handleChange}
								onFocus={this.onFocus}
								onBlur={this.onBlur} 
								id="pn" 
								type="text"
								ref="newName"
								value={this.state.userName} />
						</div>
					</div>
				</div>
			</section>
		);
	}
}