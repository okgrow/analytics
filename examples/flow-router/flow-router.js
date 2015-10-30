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
    self.currentIdentity = new ReactiveVar(analytics._user._getTraits().email || 'No Identity Set');
    self.log = new ReactiveVar([]);
    analytics.on('page', function(event, properties, options){
      var latest = self.log.get();
      latest.push("Page: " + options.path);
      self.log.set(latest);
    });
    analytics.on('identify', function(event, properties, options){
      var latest = self.log.get();
      latest.push("Identify: " + properties.email);
      self.log.set(latest);
      self.currentIdentity.set(properties.email);
    });
    analytics.on('track', function(event, properties, options){
      var latest = self.log.get();
      latest.push("Track: " + event);
      self.log.set(latest);

    });
  });

  Template.mainLayout.helpers({
    log:     function() { return Template.instance().log.get(); },
    currentIdentity: function() { return Template.instance().currentIdentity.get(); }
  });

}
