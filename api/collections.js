import { Mongo } from 'meteor/mongo';
 
export const BuddyLists = new Mongo.Collection('buddyLists');
export const Conversations = new Mongo.Collection('conversations');
export const Messages = new Mongo.Collection('messages');
export const Reports = new Mongo.Collection('reports');