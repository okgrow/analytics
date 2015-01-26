trackLogins = function () {
  if (Meteor.user) {
    if (Meteor.user()) {
      var user = Meteor.user();
      analytics.track("Signed in", {email: user.emails[0].address});
    }

    if (!Meteor.user()) {
      analytics.track("Signed out");
    }
  }
};

if (typeof Router !== 'undefined') {
  Router.onAfterAction(function() {
    analytics.page(this.route.getName());
  });
}

Meteor.startup(function () {
  Tracker.autorun(trackLogins);
});
