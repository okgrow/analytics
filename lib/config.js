Meteor.startup(function () {
  analytics.initialize({
    'Google Analytics' : {trackingId: 'UA-58359748-2'},
    'Mixpanel' : {
      token     : '',
      identify  : false,
      people    : true,
    },
  });
});
