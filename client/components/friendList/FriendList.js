import React, { Component } from 'react';

export default class FriendList extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render = () => {
		return (
			<section className={this.props.classes}>
				<div>
					<h2>Your Friends</h2>
					<div className="add-friend">
						<input type="text" placeholder="Search Contacts"/>
					</div>
					<div className="list">
						{
							this.props.contacts.map((dude, i) => {
								return (
									<div 
										className="contact"
										key={i}>
										<div>
											<img src={dude.image} alt="friend" />
											<h3>{dude.name}</h3>
											<div
												className="online"
												style={{
													background: dude.online ? "#51C68C" : "#A8AEB1"
												}}></div>
										</div>
										<div className="call-message">
											<div>
												<button></button>
												<button></button>
											</div>
										</div>
									</div>
								);
							})
						}
					</div>
				</div>
			</section>
		);
	}
}