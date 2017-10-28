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
					<div className="list-header">
						<div className="piper">
							<div className="icon"></div>
							<h2>Friends</h2>
						</div>
						<div className="add-friend">
							<input 
								type="search" 
								placeholder="Find Someone"
								onChange={this.handleSearch} />
						</div>
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