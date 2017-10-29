import { Meteor } from 'meteor/meteor';
import { BuddyLists } from '../api/buddyList.js';
import { Conversations } from '../api/conversations.js';
import { Messages } from '../api/messages.js';
import { withTracker } from 'meteor/react-meteor-data';
import App from './App.js';

export default AppContainer = withTracker(() => {
  const userSub = Meteor.subscribe('userData');
  const id = Meteor.userId();
  const user = Meteor.user();
  const usersSub = Meteor.subscribe('allUserData');
  const userFriends = Meteor.subscribe('buddyLists');
  const userConversations = Meteor.subscribe('conversations');
  const userMessages = Meteor.subscribe('messages');
  const usersReady = usersSub.ready();
  const friendsReady = userFriends.ready();
  const conversationsReady = userConversations.ready();
  const messagesReady = userMessages.ready();
  const users = Meteor.users.find().fetch();
  const friends = BuddyLists.find().fetch();
  const conversations = Conversations.find().fetch();
  const messages = Messages.find().fetch();
  const usersExist = usersReady && !!users;
  const friendsExist = friendsReady && !!friends;
  const conversationsExist = conversationsReady && !!conversations;
  const messagesExists = messagesReady && !!messages;
  return {
    id,
    user,
    usersReady,
    friendsReady,
    conversationsReady,
    messagesReady,
    usersSub,
    userFriends,
    userConversations,
    userMessages,
    usersExist,
    friendsExist,
    conversationsExist,
    messagesExists,
    users,
    friends,
    conversations,
    messages
  };
})(App);