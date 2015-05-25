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

var trackLogins = function () {
  analytics.track("Signed in");
};

var trackLogout = function () {
  analytics.track("Signed out");
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
  Package['iron:router'].Router.onRun(function() {
    analytics.page(this.route.getName());
    this.next();
  });
}

Meteor.startup(function () {
  if (Package['accounts-base']) {
    UserLoginState.init();
    UserLoginState.onLogin = function () {
      identify();
      trackLogins();
    }
    UserLoginState.onLogout = function () {
      trackLogout();
    }
  }
});
