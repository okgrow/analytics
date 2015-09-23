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

if (Package['iron:router']) {
  Package['iron:router'].Router.onRun(function() {
    var router = this;
    Tracker.afterFlush(function () { analytics.page(router.route.getName()); });
    this.next();
  });
}

if (Package['kadira:flow-router']) {
  Package['kadira:flow-router'].FlowRouter.triggers.enter([function(context){
    if (context.route && context.route.name) {
      analytics.page(context.route.name);
    } else {
      analytics.page(context.path);
    }
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
