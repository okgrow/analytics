import { Meteor } from "meteor/meteor";
import { AnalyticsUsers } from "./collections";
import { trackEventWhenReady, identifyWhenReady } from "./helpers";

/*
* getUserEmail()
* Figure out the user's correct email address. This helps the differing keys
* in the database when using oAuth login.
*/
const getUserEmail = function getUserEmail() {
  if (Meteor.userId()) {
    const user = AnalyticsUsers.findOne({ _id: Meteor.userId() }, {
      fields: {
        emails: 1,
        "services.facebook.email": 1,
        "services.google.email": 1,
        "services.github.email": 1,
      },
    });
    if (user && user.emails) {
      if (user.emails[0]) {
        return user.emails[0].address;
      }
      return null;
    } else if (user && user.services) {
      const services = user.services;
      if (services.facebook) {
        return services.facebook.email;
      } else if (services.github) {
        return services.github.email;
      } else if (services.google) {
        return services.google.email;
      }
      return null;
    }
  }
  return null;
};

/*
* trackLogins()
* track and report Meteor's login & logout events to analytics.
* TODO: Add support for sign up event. Refactor to remove initialized.
*/
let initialized = false;
const trackLogins = function trackLogins() {
  // Don't run on first time. We need to access Meteor.userId() for reactivity.
  Meteor.userId();
  if (initialized) {
    // Ehen Meteor.userId() changes this will run.
    if (Meteor.userId()) {
      // TODO I think it's not guaranteed that userEmail has been set because
      // the 'AnalyticsUsers' publication might not be ready yet.
      identifyWhenReady(Meteor.userId(), { email: getUserEmail() });
      trackEventWhenReady("Signed in");
    } else {
      trackEventWhenReady("Signed out");
    }
  }
  initialized = true;
};

export { trackLogins, getUserEmail };
