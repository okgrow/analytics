/* global Meteor */
/* global Mongo */
/* global analytics */
/* global Package */
/* global AnalyticsUsers */
/* global Tracker */
/* global _ */

// TODO Refactor to export this as a handy helper when Meteor 1.3 imports/exports are used.
let userEmail;
let initialized = false;
const SETTINGS = Meteor.settings && Meteor.settings.public &&
                 Meteor.settings.public.analyticsSettings || {};

/*
* analytics.js might not have loaded it's integrations by the time we start
* tracking events, page views and identifies.
* So we can use these *WhenReady() functions to cause the action to be
* deferred until all the intgrations are ready.
* TODO consider whether we should export something like this, maybe provide
* our own api instead of just using analytics.js' api.
*/
const trackEventWhenReady = (...args) => {
  const _args = args;
  analytics.ready(() => analytics.track.apply(this, _args));
};

const trackPageWhenReady = (...args) => {
  const _args = args;
  analytics.ready(() => analytics.page.apply(this, _args));
};

const identifyWhenReady = (...args) => {
  const _args = args;
  analytics.ready(() => analytics.identify.apply(this, _args));
};

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


const trackLogins = function trackLogins() {
  // Don't run on first time. We need to access Meteor.userId() for reactivity.
  Meteor.userId();
  if (initialized) {
    // Ehen Meteor.userId() changes this will run.
    if (Meteor.userId()) {
      // TODO I think it's not guaranteed that userEmail has been set because
      // the 'analyticsusers' publication might not be ready yet.
      identifyWhenReady(Meteor.userId(), { email: userEmail });
      trackEventWhenReady("Signed in");
    } else {
      trackEventWhenReady("Signed out");
    }
  }
  initialized = true;
};

const _IronRouter = (Package["iron:router"] && Package["iron:router"].Router);
const _FlowRouter = (Package["kadira:flow-router"] && Package["kadira:flow-router"].FlowRouter) ||
                    (Package["meteorhacks:flow-router"] && Package["meteorhacks:flow-router"].FlowRouter) ||
                    (Package["kadira:flow-router-ssr"] && Package["kadira:flow-router-ssr"].FlowRouter) ||
                    (Package["meteorhacks:flow-router-ssr"] && Package["meteorhacks:flow-router-ssr"].FlowRouter);

if (_FlowRouter && SETTINGS.autorun !== false) {
  // something context & context.context don't exist, see: #93
  _FlowRouter.triggers.enter([function (context) {
    const page = {};

    if (context.path) {
      page.path = context.path;
    }
    if (context.context && context.context.title) {
      page.title = context.context.title;
    }

    page.url = window.location.origin + page.path;

    if (context.route && context.route.name) {
      page.name = context.route.name;
    } else {
      page.name = page.path;
    }
    if (context.context && context.context.querystring) {
      page.search = `? ${context.context.querystring}`;
    } else {
      page.search = "";
    }
    if (_FlowRouter.lastRoutePath) {
      page.referrer = window.location.origin + _FlowRouter.lastRoutePath;
    } else {
      page.referrer = document.referrer;
    }
    _FlowRouter.lastRoutePath = page.path;

    trackPageWhenReady(page.name, page);
  }]);
}

initIronRouter = function initIronRouter() {
  if (_IronRouter) {
    _IronRouter.onRun(function () {
      const router = this;
      Tracker.afterFlush(function () { trackPageWhenReady(router.route.getName()); });
      this.next();
    });
  }
};


Meteor.startup(() => {
  if (!_.isEmpty(SETTINGS)) {
    if (SETTINGS.autorun !== false) {
      initIronRouter();
    }
    analytics.initialize(SETTINGS);
  } else {
    console.error("Missing analyticsSettings in Meteor.settings.public");
  }

  if (Package["accounts-base"]) {
    Tracker.autorun(function () {
      userEmail = getUserEmail();
    });
    Tracker.autorun(trackLogins);
  }
});
