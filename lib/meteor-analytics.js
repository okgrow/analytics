/*
* getUserEmail()
* Figure out the user's correct email address. This helps the differing keys
* in the database when using oAuth login.
*/

getUserEmail = function(){
  if ( Meteor.user().emails ) {
    if (Meteor.user().emails[0]) {
      return Meteor.user().emails[0].address;
    } else {
      return null;
    }
  } else if ( Meteor.user().registered_emails ) {
    if (Meteor.user().registered_emails[0]) {
      return Meteor.user().registered_emails[0].address;
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

trackLogins = function () {
  if (Meteor.user) {
    if (Meteor.user()) {
      trackSignIn();
    }
    if (!Meteor.user()) {
      trackSignOut()
    }
  }
};

trackSignIn = function(){
  var user = Meteor.user();
  if (user) {
    var userEmail = getUserEmail();
    if(userEmail){
      analytics.identify(user._id, {email: userEmail});
    }else{
      analytics.identify(user._id);
    }

    analytics.track("Signed in");
  }
}

trackSignOut = function(){
  analytics.track("Signed out");
}

if (Package['iron:router']) {
  Package['iron:router'].Router.onRun(function() {
    analytics.page(this.route.getName());
    this.next();
  });
}

Meteor.startup(function () {
  if(Package['revolutionlabs:user-login-state']){
    UserLoginState.onLogin = trackSignIn;
    UserLoginState.onLogout = trackSignOut;
    UserLoginState.init();
  }else{
    Tracker.autorun(trackLogins);
  }
});
