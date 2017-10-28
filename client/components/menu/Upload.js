import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { CloudConfig } from './CloudConfig';
import axios from 'axios';

export default class Upload extends PureComponent {

	focusUpload = (e) => this.refs.upload.focus();

	handleImage = () => {
    const imgs = this.refs.upload.files;
    const img = imgs[imgs.length - 1];
    const fd = new FormData();
    fd.append('upload_preset', CloudConfig.preset);
	  fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
	  fd.append('file', img);
    axios.post(CloudConfig.url, fd)
	  .then((res) => {
	    console.log(res);
	    Meteor.call('user.addImage', res.data.secure_url, (error, result) => {
	    	if(error) { console.log(error) } else { this.props.makeChanges(); }
	    });
	  }).catch((err) => console.log(err) );
  }

	render() {
    return (
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
    );
	}
}