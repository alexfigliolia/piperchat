import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { BuddyLists } from '../api/buddyList.js';

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
          "_id": 1
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
			owner: 1
		}
	});
	if(currentUser) {
		return schedules;
	} else {
		return this.ready();
	}
});