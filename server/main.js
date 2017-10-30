import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import './publishData';
import { BuddyLists } from '../api/buddyList.js';

Meteor.methods({

  'user.checkForBuddyList'(){
    return BuddyLists.find({owner: Meteor.userId()}).fetch();
  },

  'user.createBuddyList'(){
    return BuddyLists.insert({
      owner: Meteor.userId(),
      friends: [],
      requests: []
    });
  },

  'user.changeName'(name){
    check(name, String);
    return Meteor.users.update({ _id: Meteor.userId() }, {
      $set: { name: name }
    });
  },

  'user.cleanName'(name) {
    const buddyLists = BuddyLists.find().fetch();
    for(let i = 0; i<buddyLists.length; i++) {
      const buddyListId = buddyLists[i]._id
      for(let j = 0; j < buddyLists[i].friends.length; j++) {
        if(buddyLists[i].friends[j]._id === Meteor.userId()) {
          BuddyLists.update({_id: buddyListId}, {
            $set: {
              ['friends.' + j + '.name']: name 
            }
          });
        }
      }
      for(let k = 0; k < buddyLists[i].requests.length; j++) {
        if(buddyLists[k].requests[k]._id === Meteor.userId()) {
          BuddyLists.update({_id: buddyListId}, {
            $set: {
              ['requests.' + k + '.name']: name 
            }
          });
        }
      }
    }
  },

  'user.addImage'(url) {
    check(url, String);
    return Meteor.users.update({ _id: Meteor.userId() }, {
      $set: { image: url }
    });
    //Add garbage collection for old images
    //Fetch old image from user object and delete
  },

  'user.cleanImage'(url) {
    const buddyLists = BuddyLists.find().fetch();
    for(let i = 0; i<buddyLists.length; i++) {
      const buddyListId = buddyLists[i]._id
      for(let j = 0; j < buddyLists[i].friends.length; j++) {
        if(buddyLists[i].friends[j]._id === Meteor.userId()) {
          BuddyLists.update({_id: buddyListId}, {
            $set: {
              ['friends.' + j + '.image']: url
            }
          });
        }
      }
      for(let k = 0; k < buddyLists[i].requests.length; j++) {
        if(buddyLists[k].requests[k]._id === Meteor.userId()) {
          BuddyLists.update({_id: buddyListId}, {
            $set: {
              ['requests.' + k + '.image']: url 
            }
          });
        }
      }
    }
  }, 

  'user.sendRequest'(name, image) {
    check(name, String);
    // check(image, String);
    const user =  Meteor.users.findOne({name: name, image: image}, { _id: 1});
    return BuddyLists.update({owner: user._id}, {
      $push: {
        requests: { name: Meteor.user().name, image: Meteor.user().image, _id: Meteor.userId() }
      }
    })
  },

  'user.acceptRequest'(name, image){
    const user =  Meteor.users.findOne({name: name, image: image}, { _id: 1});
    BuddyLists.update({owner: Meteor.userId()}, {
      $pull: { 
        requests: {_id: user._id } 
      }
    });
    BuddyLists.update({owner: Meteor.userId()}, {
      $push: {
        friends: { name: name , image: image, _id: user._id } 
      }
    });
    BuddyLists.update({owner: user._id}, {
      $push: { 
        friends: { name: Meteor.user().name , image: Meteor.user().image, _id: Meteor.userId() } 
      }
    });
  }

});