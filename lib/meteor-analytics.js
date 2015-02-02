trackLogins = function () {
  if (Meteor.user) {
    if (Meteor.user()) {
      var user = Meteor.user();
      var userEmail = user.emails && user.emails[0] ? user.emails[0].address : 'n/a';
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
