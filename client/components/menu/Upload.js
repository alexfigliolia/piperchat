import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { CloudConfig, AxiosConfig } from './CloudConfig';
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
    axios.post(CloudConfig.url, fd, AxiosConfig)
	  .then((res) => {
	    console.log(res);
	    let url = res.data.secure_url.split('/');
      url.splice(-2, 0, 'q_auto/f_auto/w_200');
      url = url.join('/')
	    Meteor.call('user.addImage', url, (error, result) => {
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
