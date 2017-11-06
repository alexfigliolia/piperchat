import React, { Component } from 'react';

export default class RemoveFriend extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: "",
			confirmClasses: "confirm",
			removeFriendClasses: "rf",
			friends: [],
			search: [],
			currentSearch: ""
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.friends !== this.props.friends && this.state.currentSearch === "") {
			this.handleSearch({target: { value: ""}});
		}
	}

	select = (e) => {
		this.setState({
			selected: e.target.dataset.name,
			selectedIndex: e.target.dataset.index,
			removeFriendClasses: "rf rf-move",
			confirmClasses: "confirm confirm-show"
		})
	}

	cancel = () => {
		this.setState({
			selected: "",
			removeFriendClasses: "rf",
			confirmClasses: "confirm"
		})
	}

	confirm = (e) => {
		const id = this.props.friends[this.state.selectedIndex]._id;
		Meteor.call('user.removeFriend', id, (error, result) => {
			if(error) {
				console.log(error);
			} else {
				this.cancel();
			}
		});
	}

	handleSearch = (e) => {
		const val = e.target.value;
  	this.setState({ currentSearch: val });
  	if(val !== '') {
  		const results = [];
	    for(let i = 0; i < this.props.friends.length; i++) {
	      const friend = this.props.friends[i].name.toLowerCase();
	      if(friend.indexOf(val.toLowerCase()) !== -1) {
	        results.push(this.props.friends[i]);
	      }
	    }
	    this.setState({search: results });
  	} else {
  		this.setState({search: this.props.friends});
  	}
  }

  render = () => {
    return (
    	<section className={this.props.classes}>
    		<div className={this.state.removeFriendClasses}>
    			<h2>Which friend would you like to be unable to call or message you?</h2>
    			<div className="search-friends">
    				<input 
    					type="search" 
    					placeholder="Find a friend"
    					value={this.state.currentSearch}
    					onChange={this.handleSearch} />
    			</div>
    			<div className="remove-list">
    				{
    					this.state.search.map((friend, i) => {
	    					return (
	    						<div 
	    							className="remove-item"
	    							key={i}
	    							onClick={this.select}
	    							data-index={i}
	    							data-name={friend.name}>
	    							{friend.name}
	    						</div>
	    					);
	    				})
    				}
    			</div>
    		</div>
    		<div className={this.state.confirmClasses}>
    			<h3>Remove {this.state.selected === "" ? "Selected Friend" : this.state.selected} from Friends?</h3>
    			<div>
    				<button onClick={this.cancel}>Cancel</button>
    				<button onClick={this.confirm}>Yes</button>
    			</div>
    		</div>
    	</section>
    );
  }
}
