import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import './publishData';

Meteor.methods({

  'user.changeName'(name){
    check(name, String);
    return Meteor.users.update({ _id: Meteor.userId() }, {
      $set: { name: name }
    });
  },

  'user.addImage'(url) {
    check(url, String);
    return Meteor.users.update({ _id: Meteor.userId() }, {
      $set: { image: url }
    });
    //Add garbage collection for old images
    //Fetch old image from user object and delete
  }

});