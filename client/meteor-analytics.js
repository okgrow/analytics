// analytics.js might not have loaded it's integrations by the time we start
// tracking events, page views and identifies.
// So we can use these *WhenReady() functions to cause the action to be
// deferred until all the intgrations are ready.
//
// TODO consider whether we should export something like this, maybe provide
// our own api instead of just using analytics.js' api
var trackEventWhenReady = function () {
  var _args = arguments;
  analytics.ready(function () {analytics.track.apply(this, _args);});
};

var trackPageWhenReady = function () {
  var _args = arguments;
  analytics.ready(function () {analytics.page.apply(this, _args);});
};

var identifyWhenReady = function () {
  var _args = arguments;
  analytics.ready(function () {analytics.identify.apply(this, _args);});
};

/*
* getUserEmail()
* Figure out the user's correct email address. This helps the differing keys
* in the database when using oAuth login.
*/
getUserEmail = function(){
  if (Meteor.userId()) {
    var user = AnalyticsUsers.findOne({_id: Meteor.userId()}, {
      fields: {
        emails: 1,
        "services.facebook.email": 1,
        "services.google.email": 1,
        "services.github.email": 1
      }
    });
    if ( user && user.emails ) {
      if (user.emails[0]) {
        return user.emails[0].address;
      } else {
        return null;
      }
    } else if ( user && user.services ) {
      var services = user.services;
      if ( services.facebook ) {
        return services.facebook.email;
      } else if ( services.github ) {
        return services.github.email;
      } else if ( services.google ) {
        return services.google.email;
      } else {
        return null;
      }
    }
  }
};

var initialized;
var trackLogins = function () {
  // don't run the first time, but we need to access Meteor.userId()
  // so that it's reactive
  Meteor.userId();
  if (initialized) {
    // when Meteor.userId() changes this will run
    if (Meteor.userId()) {
      // TODO I think it's not guaranteed that userEmail has been set because
      // the 'analyticsusers' publication might not be ready yet.
      identifyWhenReady(Meteor.userId(), {email: userEmail});
      trackEventWhenReady("Signed in");
    } else {
      trackEventWhenReady("Signed out");
    }
  }
  initialized = true;
};


var _IronRouter = (Package['iron:router'] && Package['iron:router'].Router);
var _FlowRouter = (Package['kadira:flow-router'] && Package['kadira:flow-router'].FlowRouter) ||
                  (Package['meteorhacks:flow-router'] && Package['meteorhacks:flow-router'].FlowRouter) ||
                  (Package['kadira:flow-router-ssr'] && Package['kadira:flow-router-ssr'].FlowRouter) ||
                  (Package['meteorhacks:flow-router-ssr'] && Package['meteorhacks:flow-router-ssr'].FlowRouter);

if (_IronRouter) {
  _IronRouter.onRun(function() {
    var router = this;
    Tracker.afterFlush(function () { trackPageWhenReady(router.route.getName()); });
    this.next();
  });
}

if (_FlowRouter) {
  // something context & context.context don't exist, see: #93
  _FlowRouter.triggers.enter([function(context){
    var page = {};

    if (context.path){
      page.path = context.path;
    }
    if (context.context && context.context.title){
      page.title = context.context.title;
    }

    page.url = window.location.origin + page.path;

    if (context.route && context.route.name) {
      page.name = context.route.name;
    } else {
      page.name = page.path;
    }
    if (context.context && context.context.querystring) {
      page.search = "?" + context.context.querystring;
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

var userEmail;
Meteor.startup(function () {
  if (Meteor.settings && Meteor.settings.public && Meteor.settings.public.analyticsSettings) {
    analytics.initialize(Meteor.settings.public.analyticsSettings);
  } else {
    console.log("Missing analyticsSettings in Meteor.settings.public");
  }

  if (Package['accounts-base']) {
    Tracker.autorun(function () {
      userEmail = getUserEmail();
    });
    Tracker.autorun(trackLogins);
  }
});
