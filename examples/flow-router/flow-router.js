if (Meteor.isClient) {

  FlowRouter.route('/', {
    action: function(params) {
      BlazeLayout.render("mainLayout", {main: "one"});
    },
    name: "Home" // used for track
  });

  FlowRouter.route('/one', {
    action: function(params) {
      BlazeLayout.render("mainLayout", {main: "one"});
    },
    name: "One" // used for track
  });

  FlowRouter.route('/two', {
    action: function(params) {
      BlazeLayout.render("mainLayout", {main: "two"});
    },
    name: "Two" // used for track
  });

  FlowRouter.route('/three', {
    action: function(params) {
      BlazeLayout.render("mainLayout", {main: "three"});
    }
  }); // without 'name', path is used for tracking



  Template.mainLayout.onCreated(function () {
    var self = this;
    var currentIdentity = analytics._user._getTraits().email || 'No Identity Set';
    self.analyticPage = new ReactiveVar('No Page Set');
    self.analyticIdentify = new ReactiveVar(currentIdentity);
    self.analyticTrack = new ReactiveVar('No Track Called');
    self.autorun(function () {
      analytics.on('page', function(event, properties, options){
        self.analyticPage.set(options.path)
      });
      analytics.on('identify', function(event, properties, options){
        self.analyticIdentify.set(properties.email)
      });
      analytics.on('track', function(event, properties, options){
        self.analyticTrack.set(event)
      });
    });
  });

  Template.mainLayout.helpers({
    analyticPage:     function() { return Template.instance().analyticPage.get() },
    analyticIdentify: function() { return Template.instance().analyticIdentify.get() },
    analyticTrack:    function() { return Template.instance().analyticTrack.get() }
  });

}