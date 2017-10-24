import React, { PureComponent } from 'react';

export default class Menu extends PureComponent {
	render = () => {
		return (
			<section className={this.props.classes}>
				<div>
					<div className="prof">
						<img src={this.props.user.image} alt="me" />
						<h2>{this.props.user.name}</h2>
					</div>
					<div className="options">
						<button>Profile</button>
						<button>Privacy</button>
						<button>Settings</button>
					</div>
					<button>Log out</button>
				</div>
			</section>
		);
	}
}