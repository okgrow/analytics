if (Meteor.isClient) {
  Router.route('/', function () {
    this.layout('mainLayout');
    this.render('one');
  });

  Router.route('/one', function () {
    this.layout('mainLayout');
    this.render('one');
  });

  Router.route('/two', function () {
    this.layout('mainLayout');
    this.render('two');
  });

  Router.route('/three', function () {
    this.layout('mainLayout');
    this.render('three');
  });



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
