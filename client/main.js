import OKGAnalytics, { analytics, trackEventWhenReady, identifyWhenReady } from '@okgrow/auto-analytics';

/* eslint-disable import/no-extraneous-dependencies, import/extensions */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
/* eslint-enable */

const AnalyticsUsers = new Mongo.Collection('AnalyticsUsers');

const SETTINGS = (Meteor.settings
                  && Meteor.settings.public
                  && Meteor.settings.public.analyticsSettings)
                || false;

OKGAnalytics(SETTINGS);

const getUserEmail = function getUserEmail() {
  let userEmailAddress = null;

  if (Meteor.userId()) {
    const user = AnalyticsUsers.findOne({ _id: Meteor.userId() }, {
      fields: {
        emails: 1,
        'services.facebook.email': 1,
        'services.google.email': 1,
        'services.github.email': 1,
      },
    });

    if (user && user.emails && user.emails[0]) {
      userEmailAddress = user.emails[0].address;
    } else if (user && user.services) {
      const services = user.services;

      if (services.facebook) {
        userEmailAddress = services.facebook.email;
      } else if (services.github) {
        userEmailAddress = services.github.email;
      } else if (services.google) {
        userEmailAddress = services.google.email;
      }
    }
  }

  return userEmailAddress;
};

// Track and report Meteor's login & logout events to analytics.
// TODO: Add support for sign up event.
// TODO: Refactor to remove initialized.
let initialized = false;

const trackLogins = function trackLogins() {
  // Don't run on first time. We need to access Meteor.userId() for reactivity.
  Meteor.userId();

  if (initialized) {
    // When Meteor.userId() changes this will run.
    if (Meteor.userId()) {
      // TODO: I think it's not guaranteed that userEmail has been set because the
      // 'AnalyticsUsers' publication might not be ready yet.
      identifyWhenReady(Meteor.userId(), { email: getUserEmail() });
      trackEventWhenReady('Signed in');
    } else {
      trackEventWhenReady('Signed out');
    }
  }

  initialized = true;
};

Meteor.startup(() => {
  if (Package['accounts-base']) {
    Tracker.autorun(() => {
      userEmail = getUserEmail();
    });

    Tracker.autorun(trackLogins);
  }
});

export { analytics }; // eslint-disable-line import/prefer-default-export
