import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { validateEmail, validateName } from '../../helpers/helpers';

export default class Login extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	action: "Login",
	  	error: "",
	  	buttonClasses: "login-button"
	  }
	}

	focus = (e) => e.target.parentNode.classList.add('focus');

	blur = (e) => e.target.value === "" && e.target.parentNode.classList.remove('focus');

	switchAction = (e) => {
		this.setState({  action: this.state.action === 'Login' ? 'Sign Up' : 'Login' });
	}

	checkInputs = () => {
		this.setState({buttonClasses: "login-button login-thinking"});
		const e = this.refs.email.value;
		const p = this.refs.password.value;
		if(!validateEmail(e) || p.length <= 4) {
			this.setState({ error: "Please try again", buttonClasses: "login-button" });
		} else {
			if(this.state.action === "Sign Up") {
				const n = validateName(this.refs.name.value);
				if(n) {
					this.signUp(n, e, p);
					this.setState({ error: "" });
				} else {
					this.setState({ error: "Please try again", buttonClasses: "login-button" });
				}
			} else {
				this.setState({ error: "" });
				this.login(e, p);
			}
		}
	}

	login = (e, p) => {
		Meteor.loginWithPassword(e.toLowerCase(), p, (err) => {
      if(err){
        this.setState({ error: err.reason, buttonClasses: "login-button" });
      } else {
        this.setState({ error: "", buttonClasses: "login-button, login-thinking, login-thunk" });
      }
    });
	}

  signUp = (n, e, p) => {
    Accounts.createUser({name: n, email: e.toLowerCase(), password: p}, (err) => {
      if(err){
        this.setState({ error: err.reason, buttonClasses: "login-button" });
      } else {
        Meteor.loginWithPassword(e, p, (err) => {
          if(err) {
            this.setState({ error: err.reason, buttonClasses: "login-button" });
          } else {
            this.setState({ error: "", buttonClasses: "login-button, login-thinking, login-thunk" });
          }
        });
      }
    });
  }

  render = () => {
    return (
      <section className="login">
      	<div>
      	<img src="pp.svg" alt="pied piper" />
      		<h1>{this.state.action}</h1>
      		<div>
      			{
      				this.state.error !== "" &&
      				<h2>{this.state.error}</h2>
      			}
      			{
      				this.state.action === "Sign Up" &&
      				<div className="input">
	      				<label htmlFor="fn">Full Name</label>
	      				<input
	      					onFocus={this.focus}
	      					onBlur={this.blur} 
                  ref="name"
	      					id="fn" 
	      					type="text" />
      				</div>
      			}
      			<div className="input">
      				<label htmlFor="em">Email</label>
      				<input
      					onFocus={this.focus}
      					onBlur={this.blur} 
      					ref="email"
      					id="em" 
      					type="email" />
      			</div>
      			<div className="input">
      				<label htmlFor="pw">Password</label>
      				<input
      					onFocus={this.focus}
      					onBlur={this.blur} 
      					ref="password"
      					id="pw" 
      					type="password" />
      			</div>
      		</div>
      		<button 
      			className={this.state.buttonClasses}
      			onClick={this.checkInputs}>{this.state.action}
      				<img src="loader.gif" alt="loading" />
      				<img src="check.svg" alt="loaded" />
      		</button>
      		<h3>{this.state.action === "Login" ? "Are you new here?" : "Already a member?"}&nbsp;
      			<a onClick={this.switchAction}>{this.state.action === "Login" ? "Sign up!" : "Login!"}</a>
      		</h3>
      	</div>
      </section>
    );
  }
}
