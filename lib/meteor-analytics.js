/*
* getUserEmail()
* Figure out the user's correct email address. This helps the differing keys
* in the database when using oAuth login.
*/
getUserEmail = function(){
  if (Meteor.userId()) {
    var user = Meteor.users.findOne({_id: Meteor.userId()}, {
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
      identify();
      analytics.track("Signed in");
    } else {
      analytics.track("Signed out");
    }
  }
  initialized = true;
};

var identify = function () {
  Tracker.nonreactive(function () {
    // don't re-run when userEmail changes
    if (userEmail) {
      analytics.identify(Meteor.userId(), {email: userEmail});
    }
  });
};

var _IronRouter = (Package['iron:router'] && Package['iron:router'].IronRouter);
var _FlowRouter = (Package['kadira:flow-router'] && Package['kadira:flow-router'].FlowRouter) ||
                  (Package['meteorhacks:flow-router'] && Package['meteorhacks:flow-router'].FlowRouter) ||
                  (Package['kadira:flow-router-ssr'] && Package['kadira:flow-router-ssr'].FlowRouter) ||
                  (Package['meteorhacks:flow-router-ssr'] && Package['meteorhacks:flow-router-ssr'].FlowRouter);

if (_IronRouter) {
  _IronRouter.onRun(function() {
    var router = this;
    Tracker.afterFlush(function () { analytics.page(router.route.getName()); });
    this.next();
  });
}

if (_FlowRouter) {
  _FlowRouter.triggers.enter([function(context){
    var page = {};
    page.path = context.context.pathname;
    page.title = context.context.title;
    page.url = window.location.origin + page.path;

    if (context.route && context.route.name) {
      page.name = context.route.name;
    } else {
      page.name = page.path;
    }
    if (context.context.querystring) {
      page.search = "?" + context.context.querystring;
    } else {
      page.search = "";
    }
    if (context.oldRoute && context.oldRoute.path) {
      page.referrer = window.location.origin + context.oldRoute.path;
    }

    analytics.page(page.name, page);
  }]);
}

var userEmail;
Meteor.startup(function () {
  if (Package['accounts-base']) {
    Tracker.autorun(function () {
      userEmail = getUserEmail();
    });
    Tracker.autorun(trackLogins);
  }
});
