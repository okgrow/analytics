/*
* getUserEmail()
* Figure out the user's correct email address. This helps the differing keys
* in the database when using oAuth login.
*/
getUserEmail = function(userId){
  var getUser = Meteor.users.findOne({_id: userId});
  if ( getUser.emails ) {
    if (getUser.emails[0]) {
      return getUser.emails[0].address;
    } else {
      return null;
    }
  } else if ( getUser.services ) {
    var services = getUser.services;
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

trackLogins = function () {
  if (Meteor.user) {
    if (Meteor.user()) {
      var user = Meteor.user();
      var userEmail = getUserEmail(user._id)
      analytics.identify(user._id, {email: userEmail});
    }

    if (!Meteor.user()) {
      analytics.track("Signed out");
    }
  }
};

if (Package['iron:router']) {
  Package['iron:router'].Router.onAfterAction(function() {
    analytics.page(this.route.getName());
  });
}

Meteor.startup(function () {
  Tracker.autorun(trackLogins);
});
