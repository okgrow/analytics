Meteor.startup(function () {
  analytics.initialize(
    Meteor.settings.public.analyticsSettings
  );
});
