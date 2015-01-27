Meteor.startup(function () {
  if (Meteor.settings && Meteor.settings.public && Meteor.settings.public.analyticsSettings) {
    analytics.initialize(Meteor.settings.public.analyticsSettings);
  } else {
    console.log("Missing analyticsSettings in Meteor.settings.public");
  }
});
