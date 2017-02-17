import { Mongo } from 'meteor/mongo'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions

const AnalyticsUsers = new Mongo.Collection('AnalyticsUsers');

export { AnalyticsUsers }; // eslint-disable-line import/prefer-default-export
