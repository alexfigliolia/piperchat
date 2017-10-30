import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { BuddyLists } from '../api/buddyList.js';
import { Conversations } from '../api/conversations.js';
import { Messages } from '../api/messages.js';
import { ReactiveVar } from 'meteor/reactive-var';

const convos = new ReactiveVar([]);

function updateRV(val) {
  convos.set(val);
}

Accounts.onCreateUser((options, user) => {
  user.name = options.name;
  return user;
});

Meteor.publish('userData', function() {
  var currentUser;
  currentUser = this.userId;
  if (currentUser) {
     return Meteor.users.find({
        _id: currentUser
     }
     ,{
       fields: {
          "name" : 1,
          "image": 1,
          "_id": 1
       }
     });
  } else {
    return this.ready();
  }
});

Meteor.publish('allUserData', function() {
  var currentUser;
  currentUser = this.userId;
  if (currentUser) {
     return Meteor.users.find({},
     {
       fields: {
          "name" : 1,
          "image": 1
       }
     });
  } else {
    return this.ready();
  }
});

Meteor.publish('buddyLists', function(){
	var currentUser;
	currentUser = this.userId;
	var schedules = BuddyLists.find({owner: currentUser}, {
		fields: {
			friends: 1,
      requests: 1,
      sentRequests: 1,
			owner: 1,
		}
	});
	if(currentUser) {
		return schedules;
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
      const messages = Messages.find({chatId: {$in: convos.curValue}},{
        fields: {
          by: 1,
          to: 1,
          text: 1,
          date: 1,
          chatId: 1
        }
      });
      return messages;
    } else {
      return this.ready();
    }
  });
});