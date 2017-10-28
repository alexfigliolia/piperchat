import { Meteor } from 'meteor/meteor';
import { BuddyLists } from '../api/buddyList.js';
import { Conversations } from '../api/conversations.js';
import { Messages } from '../api/messages.js';
import { withTracker } from 'meteor/react-meteor-data';
import App from './App.js';

export default AppContainer = withTracker((props) => {
  const users = Meteor.subscribe('userData');
  const id = Meteor.userId();
  const user = Meteor.user();
  const userFriends = Meteor.subscribe('buddyLists');
  const userConversations = Meteor.subscribe('conversations');
  const userMessages = Meteor.subscribe('messages');
  const friendsReady = userFriends.ready();
  const conversationsReady = userConversations.ready();
  const messagesReady = userMessages.ready();
  const friends = BuddyLists.find({owner: id}).fetch();
  const conversations = Conversations.find({owner: id}).fetch();
  const messages = Messages.find({owner: id}).fetch();
  const friendsExist = friendsReady && !!friends;
  const conversationsExist = conversationsReady && !!conversations;
  const messagesExists = messagesReady && !!messages;
  return {
    id,
    user,
    friendsReady,
    conversationsReady,
    messagesReady,
    userFriends,
    userConversations,
    userMessages,
    friendsExist,
    conversationsExist,
    messagesExists,
    friends,
    conversations,
    messages
  };
})(App);