Meteor.startup(function () {
  analytics.initialize({
    'Google Analytics' : {trackingId: ''},
    'Mixpanel' : {
      token     : '',
      identify  : false,
      people    : true,
    },
  });
});
