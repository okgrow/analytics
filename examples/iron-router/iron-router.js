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