import { Meteor } from 'meteor/meteor';
import { BuddyLists } from '../api/buddyList.js';
// import { Employees } from '../api/employees.js';
// import { Group } from '../api/group.js';
import { createContainer } from 'meteor/react-meteor-data';
import App from './App.js';

export default AppContainer = createContainer(() => {
  const users = Meteor.subscribe('userData');
  const id = Meteor.userId();
  const user = Meteor.user();
  const userFriends = Meteor.subscribe('buddyLists');
  // const userEmployees = Meteor.subscribe('employees');
  // const userGroup = Meteor.subscribe('group');
  const friendsReady = userFriends.ready();
  // const employeesReady = userEmployees.ready();
  // const groupReady = userGroup.ready();
  const friends = BuddyLists.find({owner: id}).fetch();
  // const employees = Employees.find({owner: id}).fetch();
  // const group = Group.find({owner: id}).fetch();
  const friendsExist = friendsReady && !!friends;
  // const employeesExist = employeesReady && !!employees;
  // const groupExists = groupReady && !!group;
  return {
    id,
    user,
    friendsReady,
    // employeesReady,
    // groupReady,
    // userSchedules,
    // userEmployees,
    // userGroup,
    friendsExist,
    // employeesExist,
    // groupExists,
    friends,
    // employees,
    // group
  };
}, App);