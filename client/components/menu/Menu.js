import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Menu extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			classes: "",
			profClasses: "prof",
			profileClasses: "profile",
			profText: "Profile"
		}
	}

	logout = () => {
		Meteor.logout();
	}

	onFocus = (e) => e.target.parentNode.classList.add('focus');

	onBlur = (e) => {
		if(e.target.value === "") e.target.parentNode.classList.remove('focus');
	}

	handleChange = (e) => {
		this.setState({ profText: e.target.value === "" ? "Close" : "Save" });
	}

	makeChanges = () => {
		this.setState((prevState, prevProps) => {
			return {
				profClasses: prevState.profClasses === "prof" ? "prof prof-flip" : "prof",
				profileClasses: prevState.profileClasses === "profile" ? "profile profile-show" : "profile",
				profText: prevState.profText === "Profile" ? "Close" : "Profile"
			}
		});
	}

	handleImage = () => {
    const imgs = this.refs.upload.files;
    const img = imgs[imgs.length - 1].name;
    this.props.handleNewImage(window.URL.createObjectURL(imgs[imgs.length - 1]));
  }

  handleNameChange = () => {
 		if(this.refs.newName.value !== "") {
 			const name = this.refs.newName.value;
	    this.props.updateName(name);
	    this.refs.newName.value = "";
	    this.refs.newName.parentNode.blur();
	    this.refs.newName.parentNode.classList.remove('focus');
	  }
	  this.makeChanges();
  }

  focusUpload = (e) => {
  	this.refs.upload.focus();
  }

	render = () => {
		return (
			<section className={this.props.classes}>
				<div>
					<div className={this.state.profClasses}>
						<div className="image">
							<img src={this.props.user.image} alt="me" />
							<div 
								onClick={this.focusUpload}
								className="upload">
								<input 
									ref="upload"
									type="file" 
									name="myImage" 
									accept="image/*" 
									onChange={this.handleImage} />
							</div>
						</div>
						<h2>{this.props.user.name}</h2>
					</div>
					<div className="options">
						<button 
							onClick={this.state.profText === "Profile" ? this.makeChanges : this.handleNameChange}
							style={{
								color: this.state.profText === "Profile" ? "#828282" : "#fff",
								background: this.state.profText === "Profile" ? "none" : "#139A8F"
							}}>{this.state.profText}</button>
						<button>Privacy</button>
						<button>Settings</button>
					</div>
					<button>Log out</button>
					<div className={this.state.profileClasses}>
						<div className="input">
							<label htmlFor="pn">Name</label>
							<input
								onChange={this.handleChange}
								onFocus={this.onFocus}
								onBlur={this.onBlur} 
								id="pn" 
								type="text"
								ref="newName" />
						</div>
					</div>
				</div>
			</section>
		);
	}
}