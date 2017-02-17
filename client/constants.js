import { Meteor } from 'meteor/meteor'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions

const SETTINGS = (Meteor.settings
                  && Meteor.settings.public
                  && Meteor.settings.public.analyticsSettings)
                 || false;

export { SETTINGS }; // eslint-disable-line import/prefer-default-export
