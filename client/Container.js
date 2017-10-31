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
  const userBuddyList = Meteor.subscribe('buddyLists');
  const userConversations = Meteor.subscribe('conversations');
  const userMessages = Meteor.subscribe('messages');
  const usersReady = usersSub.ready();
  const buddyListReady = userBuddyList.ready();
  const conversationsReady = userConversations.ready();
  const messagesReady = userMessages.ready();
  const users = Meteor.users.find().fetch();
  const buddyList = BuddyLists.find().fetch();
  const conversations = Conversations.find().fetch();
  const messages = Messages.find({}, {sort: {date: 1}}).fetch();
  const usersExist = usersReady && !!users;
  const buddyListExist = buddyListReady && !!buddyList;
  const conversationsExist = conversationsReady && !!conversations;
  const messagesExists = messagesReady && !!messages;
  return {
    id,
    user,
    usersReady,
    buddyListReady,
    conversationsReady,
    messagesReady,
    usersSub,
    userBuddyList,
    userConversations,
    userMessages,
    usersExist,
    buddyListExist,
    conversationsExist,
    messagesExists,
    users,
    buddyList,
    conversations,
    messages
  };
})(App);