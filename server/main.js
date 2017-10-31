import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import './publishData';
import { BuddyLists } from '../api/buddyList.js';
import { Conversations } from '../api/conversations.js';
import { Messages } from '../api/messages.js';

Meteor.methods({

  'user.checkForBuddyList'(){
    return BuddyLists.find({owner: Meteor.userId()}).fetch();
  },

  'user.createBuddyList'(){
    return BuddyLists.insert({
      owner: Meteor.userId(),
      friends: [],
      requests: [],
      sentRequests: []
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
      if(buddyLists[i].friends.length > 0) {
        for(let j = 0; j < buddyLists[i].friends.length; j++) {
          if(buddyLists[i].friends[j]._id === Meteor.userId()) {
            BuddyLists.update({_id: buddyListId}, {
              $set: { ['friends.' + j + '.name']: name }
            });
            break;
          }
        }
      }
      if(buddyLists[i].requests.length > 0) {
        for(let k = 0; k < buddyLists[i].requests.length; k++) {
          if(buddyLists[i].requests[k]._id === Meteor.userId()) {
            BuddyLists.update({_id: buddyListId}, {
              $set: { ['requests.' + k + '.name']: name }
            });
            break;
          }
        }
      }
      if(buddyLists[i].sentRequests.length > 0) {
        for(let l = 0; l < buddyLists[i].sentRequests.length; l++) {
          if(buddyLists[i].sentRequests[l]._id === Meteor.userId()) {
            BuddyLists.update({_id: buddyListId}, {
              $set: { ['sentRequests.' + l + '.name']: name }
            });
            break;
          }
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
            $set: { ['friends.' + j + '.image']: url }
          });
          break;
        }
      }
      for(let k = 0; k < buddyLists[i].requests.length; k++) {
        if(buddyLists[i].requests[k]._id === Meteor.userId()) {
          BuddyLists.update({_id: buddyListId}, {
            $set: { ['requests.' + k + '.image']: url }
          });
          break;
        }
      }
      for(let l = 0; l < buddyLists[i].sentRequests.length; l++) {
        if(buddyLists[i].sentRequests[l]._id === Meteor.userId()) {
          BuddyLists.update({_id: buddyListId}, {
            $set: { ['sentRequests.' + l + '.image']: url }
          });
          break;
        }
      }
    }
  }, 

  'user.sendRequest'(name, image) {
    check(name, String);
    // check(image, String);
    const user =  Meteor.users.findOne({name: name, image: image}, { _id: 1});
    BuddyLists.update({owner: Meteor.userId()}, {
      $push: { sentRequests: {name: user.name, image: user.image, _id: user._id} }
    });
    const bl = BuddyLists.find({owner: user._id}).fetch()[0];
    const reqs = bl.requests;
    let exists = false;
    for(let i = 0; i < reqs.length; i++) {
      if(Meteor.userId() === reqs[i]._id) exists = true;
      break;
    }
    if(!exists) {
      return BuddyLists.update({owner: user._id}, {
        $push: { requests: { name: Meteor.user().name, image: Meteor.user().image, _id: Meteor.userId() } }
      })
    }
  },

  'user.acceptRequest'(name, image){
    const user =  Meteor.users.findOne({name: name, image: image}, { _id: 1});
    BuddyLists.update({owner: Meteor.userId()}, {
      $pull: { requests: {_id: user._id } },
      $push: { friends: { name: name , image: image, _id: user._id } }
    });
    BuddyLists.update({owner: user._id}, {
      $push: { friends: { name: Meteor.user().name , image: Meteor.user().image, _id: Meteor.userId() } },
      $pull: { sentRequests: { _id: Meteor.userId()} }
    });
  },

  'user.denyRequest'(name, image) {
    const user =  Meteor.users.findOne({name: name, image: image}, { _id: 1});
    BuddyLists.update({owner: user._id}, {
      $pull: { sentRequests: {_id: Meteor.userId()} }
    });
    const bl = BuddyLists.find({owner: Meteor.userId()}).fetch()[0];
    const reqs = bl.requests;
    for(let i = 0; i<reqs.length; i++) {
      if(reqs[i]._id === user._id) {
        BuddyLists.update({owner: Meteor.userId()}, {
          $pull: { requests: { _id: user._id} }
        });
        break;
      }
    }
  },

  'convo.create'(name, image) {
    check(name, String);
    const them = Meteor.users.findOne({name: name, image: image}, { _id: 1});
    const exists = Conversations.find({ owners: {$all: [them._id, Meteor.userId()]} }).fetch();
    if(exists.length === 0) {
      return Conversations.insert({
        owners: [them._id, Meteor.userId()]
      });
    }
  },

  'message.send'(name, image, text){
    check(name, String);
    check(text, String);
    const them = Meteor.users.findOne({name: name, image: image}, { _id: 1});
    const convo = Conversations.find({ owners: {$all: [them._id, Meteor.userId()]} }, {_id: 1}).fetch();
    if(convo.length !== 0) {
      return Messages.insert({
        conversation: convo[0]._id,
        from: {name: Meteor.user().name, image: Meteor.user().image, _id: Meteor.userId()}, 
        to: {name: them.name, image: them.image, _id: them._id},
        date: new Date(),
        text: text
      });
    }
  }

});