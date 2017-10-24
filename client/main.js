import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../startup/accounts-config.js';
import AppContainer from './Container.js';
 
Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('root'));
});