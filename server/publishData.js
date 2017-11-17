import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { BuddyLists, Conversations, Messages } from '../api/collections.js';
import { ReactiveVar } from 'meteor/reactive-var';

const convos = new ReactiveVar([]);
const friends = new ReactiveVar([]);

function updateRV(val) {
  convos.set(val);
}

function updateFriends(id) {
  const list = BuddyLists.find({owner: id}).fetch();
  const userFriends = list[0].friends;
  const nv = [];
  for(let i = 0; i<userFriends.length; i++) {
    nv.push(userFriends[i]._id);
  }
  friends.set(nv);
}

Accounts.onCreateUser((options, user) => {
  user.name = options.name;
  user.image = null;
  user.newMessages = [];
  return user;
});

Meteor.publish('userData', function() {
  let currentUser;
  currentUser = this.userId;
  if (currentUser) {
     return Meteor.users.find({
        _id: currentUser
     },
     {
       fields: {
          "name" : 1,
          "profile.peerId" : 1,
          "image": 1,
          "_id": 1,
          "newMessages": 1
       }
     });
  } else {
    return this.ready();
  }
});

Meteor.publish('userPresence', function() {
  this.autorun(function(computation) {
    let currentUser;
    currentUser = this.userId;
    if (currentUser) {
      updateFriends(currentUser);
      let filter = {userId: { $in: friends.curValue }}; 
      return Presences.find(filter, { fields: { state: true, userId: true }});
    } else {
      return this.ready();
    }
  });
});

Meteor.publish('allUserData', function() {
  let currentUser;
  currentUser = this.userId;
  if (currentUser) {
     return Meteor.users.find({},
     {
       fields: {
          "name" : 1,
          "image": 1,
          "_id" : 1,
          "emails": 0,
          "newMessages": 0
       }
     });
  } else {
    return this.ready();
  }
});

Meteor.publish('buddyLists', function(){
	let currentUser;
	currentUser = this.userId;
  if(currentUser) {
  	const buddyLists = BuddyLists.find({owner: currentUser}, {
  		fields: {
  			friends: 1,
        requests: 1,
        sentRequests: 1,
  			owner: 1,
  		}
  	});
    updateFriends(currentUser);
		return buddyLists;
	} else {
		return this.ready();
	}
});

Meteor.publish('conversations', function() {
  let currentUser;
  currentUser = this.userId;
  if(currentUser) {
    const convos = Conversations.find({owners: currentUser}, {
      fields: {
        label: 1,
        owners: 1
      }
    });
    return convos;
  } else {
    return this.ready();
  }
});

Meteor.publish('messages', function() {
  this.autorun(function(computation) {
    let currentUser;
    currentUser = this.userId;
    if(currentUser) {
      const cs = Conversations.find({owners: currentUser}).fetch();
      let chatIds = [];
      for(let i = 0; i<cs.length; i++) {
        chatIds.push(cs[i]._id);
      }
      updateRV(chatIds);
      const messages = Messages.find({conversation: {$in: convos.curValue}},{
        fields: {
          from: 1,
          to: 1,
          text: 1,
          date: 1,
          conversation: 1
        }
      });
      return messages;
    } else {
      return this.ready();
    }
  });
});