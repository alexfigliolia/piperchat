import { Meteor } from 'meteor/meteor';
// import { Schedules } from '../api/schedules.js';
// import { Employees } from '../api/employees.js';
// import { Group } from '../api/group.js';
import { createContainer } from 'meteor/react-meteor-data';
import App from './App.js';

export default AppContainer = createContainer(() => {
  const users = Meteor.subscribe('userData');
  const id = Meteor.userId();
  // const user = Meteor.user();
  // const userSchedules = Meteor.subscribe('schedules');
  // const userEmployees = Meteor.subscribe('employees');
  // const userGroup = Meteor.subscribe('group');
  // const schedulesReady = userSchedules.ready();
  // const employeesReady = userEmployees.ready();
  // const groupReady = userGroup.ready();
  // const schedules = Schedules.find({owner: id}, {sort: {'schedule.for': 1}}).fetch();
  // const employees = Employees.find({owner: id}).fetch();
  // const group = Group.find({owner: id}).fetch();
  // const schedulesExist = schedulesReady && !!schedules;
  // const employeesExist = employeesReady && !!employees;
  // const groupExists = groupReady && !!group;
  return {
    id,
    // user,
    // schedulesReady,
    // employeesReady,
    // groupReady,
    // userSchedules,
    // userEmployees,
    // userGroup,
    // schedulesExist,
    // employeesExist,
    // groupExists,
    // schedules,
    // employees,
    // group
  };
}, App);