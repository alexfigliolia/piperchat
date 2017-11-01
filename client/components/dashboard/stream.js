let rs = null;
let peerConn = null;

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
			return err;
		  onFailConnect();
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
	// this.setState({ meUrl: stream});
	// this.stream = stream;
}

const onFailConnect = () => console.log('fail');

const closeStream = () => {
	rs.getTracks()[0].stop();
}

function prepareCall() {
  peerConn = new RTCPeerConnection(peerConnCfg);
  // send any ice candidates to the other peer
  peerConn.onicecandidate = onIceCandidateHandler;
  // once remote stream arrives, show it in the remote video element
  peerConn.onaddstream = onAddStreamHandler;
};

export { getLocalStream, closeStream };