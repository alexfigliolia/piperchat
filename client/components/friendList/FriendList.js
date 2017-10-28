import React, { Component } from 'react';
import Friend from './Friend';

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
									<Friend 
										key={i}
										name={dude.name}
										image={dude.image}
										online={dude.online}
										openChat={this.props.openChat} />
								);
							})
						}
					</div>
				</div>
			</section>
		);
	}
}