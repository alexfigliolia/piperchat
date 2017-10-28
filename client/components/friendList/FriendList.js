import React, { Component } from 'react';

export default class FriendList extends Component {
	constructor(props) {
		super(props);
	}

	handleSearch = (e) => {
		this.props.handleSearch(e.target.value);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps !== this.props && this.props.classes === "friend-list") {
			this.refs.list.scrollTop = 0;
		}
	}

	render = () => {
		return (
			<section className={this.props.classes}>
				<div>
					<h2>Your Friends</h2>
					<div className="add-friend">
						<input 
							type="search" 
							placeholder="Search Contacts"
							onChange={this.handleSearch} />
					</div>
					<div ref="list" className="list">
						{
							this.props.search.map((dude, i) => {
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
												<button
													data-with={dude.name} 
													onClick={this.props.openChat}></button>
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