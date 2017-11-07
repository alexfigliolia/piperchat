import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class ReportAbuse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reportClasses: "rp",
			thankYouClasses: "thank-you"
		}
	}

  componentWillReceiveProps = (nextProps) => {
  	if(nextProps.classes === "report-abuse") {
  		this.refs.t.value = '';
  		this.setState({
				reportClasses: "rp",
				thankYouClasses: "thank-you"
			});
  	}
  }

  reportAbuse = (e) => {
  	const a = this.refs.t.value;
  	if(a !== "") {
  		Meteor.call('user.reportAbuse', a, (error, result) => {
  			if(error){
  				console.log(error);
  			} else {
  				this.refs.t.value = '';
  				this.setState({
  					reportClasses: "rp rp-hide",
						thankYouClasses: "thank-you thank-you-show"
  				});
  			}
  		});
  	}
  }

  render = () => {
    return (
    	<section className={this.props.classes}>
    		<div>
    			<h2>Report Abuse</h2>
    			<p>Please use this area to report any misuse of our platform</p>
    			<div className={this.state.reportClasses}>
    				<textarea 
    					ref="t" 
    					placeholder="Please include the name of any user(s) involved"></textarea>
  					<div>
  						<button onClick={this.props.toggleReportAbuse}>Cancel</button>
  						<button onClick={this.reportAbuse}>Submit</button>
  					</div>
    			</div>
    			<div className={this.state.thankYouClasses}>
    				<h2>Thank you!</h2>
    				<p>We at Piper Chat thank you for the time you've taken to make our platform a better place!</p>
    				<button onClick={this.props.toggleReportAbuse}>Go Back</button>
    			</div>
    		</div>
    	</section>
    );
  }
}
