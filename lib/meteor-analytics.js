/*
* getUserEmail()
* Figure out the user's correct email address. This helps the differing keys
* in the database when using oAuth login.
*/
getUserEmail = function(){
  if (Meteor.user()) {
    if ( Meteor.user().emails ) {
      if (Meteor.user().emails[0]) {
        return Meteor.user().emails[0].address;
      } else {
        return null;
      }
    } else if ( Meteor.user().services ) {
      var services = Meteor.user().services;
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
}

var trackLogins = function () {
  if (Meteor.userId()) {
    analytics.track("Signed in");
  }

  if (!Meteor.userId()) {
    console.log(">> user logged out");
    analytics.track("Signed out");
  }
};

var identify = function () {
  if (Meteor.userId()) {
    var userEmail = getUserEmail();
    if (userEmail) {
      analytics.identify(Meteor.userId(), {email: userEmail});
    }
  }
};

if (Package['iron:router']) {
  console.log("package iron:router found!!");
  Package['iron:router'].Router.onRun(function() {
    console.log("hit onRun!!");
    analytics.page(this.route.getName());
    this.next();
  });
}

Meteor.startup(function () {
  Tracker.autorun(trackLogins);
  Tracker.autorun(identify);
});
