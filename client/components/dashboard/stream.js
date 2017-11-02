import '../../peer.js';

let rs = null;
let peerConn = null;
let peerID = null;
let ls = null;

const peerConnCfg = {
	'iceServers': [
		{'url': 'stun:stun.services.mozilla.com'}, 
   	{'url': 'stun:stun.l.google.com:19302'}
  ]
};

const getLocalStream = () => {
	if (navigator.mediaDevices === undefined) navigator.mediaDevices = {};
	if (navigator.mediaDevices.getUserMedia === undefined) {
	  navigator.mediaDevices.getUserMedia = function(constraints) {
	    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	    if (!getUserMedia) {
	      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
	    }
	    return new Promise(function(resolve, reject) {
	      getUserMedia.call(navigator, constraints, resolve, reject);
	    });
	  }
	}
	const c  = { audio: false, video: true };
	navigator.mediaDevices.getUserMedia(c)
		.then((stream) => {
		  onInitConnect(stream);
		  rs = stream;
		})
		.catch((err) => {
			console.log(err);
			onFailConnect();
			return err;
		});
	// this.pc = new RTCPeerConnection(null);
}

const onInitConnect = (stream) => {
	const me = document.querySelector('#me');
	const you = document.querySelector('#you');
	window.url = window.URL || window.webkitURL;
	if ("srcObject" in me) {
		me.srcObject = stream;
		you.srcObject = stream;
	} else {
		me.src = window.URL.createObjectURL(stream);
		you.src = window.URL.createObjectURL(stream);
	}
	ls = stream;
	initCon();
	// this.setState({ meUrl: stream});
	// this.stream = stream;
}

const onFailConnect = () => console.log('fail');

const closeStream = () => {
	rs.getTracks()[0].stop();
}


function initCon(){
	window.peer = new Peer({
	  key: '7t5hftjgba2fyldi',
	  debug: 3,
	  config: {'iceServers': [
	    { url: 'stun:stun.l.google.com:19302' },
	    { url: 'stun:stun1.l.google.com:19302' },
	  ]}
	});

	peer.on('open', () => {
	  peerID = peer.id;
	  Meteor.call('user.updatePeerID', peer.id, (error, result) => {
	  	if(error) console.log(error);
	  })
	});

	peer.on('call', function (incomingCall) {
	  window.currentCall = incomingCall;
	  //Display accept/deny call UI

	  //On answer follow through
	  incomingCall.answer(window.localStream);
	  incomingCall.on('stream', function (remoteStream) {
	    window.remoteStream = remoteStream;
	    const you = document.getElementById("you")
	    window.url = window.URL || window.webkitURL;
			if ("srcObject" in you) {
				you.srcObject = remoteStream;
			} else {
				you.src = window.URL.createObjectURL(remoteStream);
			}
			document.getElementById('csc').classList.add('received');
	  });
	});
}

const setUpCall = (peerId) => {
  const outgoingCall = peer.call(peerId, ls);
  window.currentCall = outgoingCall;
  outgoingCall.on('stream', function (remoteStream) {
    window.remoteStream = remoteStream;
    const you = document.getElementById("you")
    window.url = window.URL || window.webkitURL;
		if ("srcObject" in you) {
			you.srcObject = remoteStream;
		} else {
			you.src = window.URL.createObjectURL(remoteStream);
		}
  });
}

const endCall = () => {
	window.currentCall.close();
	document.getElementById('csc').classList.remove('calling-show', 'received');
}

export { getLocalStream, closeStream, setUpCall, endCall, initCon };