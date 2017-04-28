import { analytics } from 'meteor/okgrow:analytics'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions

if (Meteor.isClient) {
  Router.route('/', function routeRoot() {
    this.layout('mainLayout');
    this.render('one');
  }, {
    name: 'home',
  });

  Router.route('/one', function routeOne() {
    this.layout('mainLayout');
    this.render('one');
  }, {
    name: 'one',
  });

  Router.route('/two', function routeTwo() {
    this.layout('mainLayout');
    this.render('two');
  }, {
    name: 'two',
  });

  Router.route('/three', function routeThree() {
    this.layout('mainLayout');
    this.render('three');
  }, {
    name: 'three',
  });

  Template.mainLayout.onCreated(function mainLayoutOnCreated() {
    Meteor.subscribe('oauthInfo');
    const self = this;
    self.log = new ReactiveVar([]);
    self.currentIdentity = new ReactiveVar('No Identity Set');

    // We don't want to register analytics if it has been blocked by an adblocker.
    if (typeof analytics === 'undefined') return;

    self.currentIdentity.set(analytics._user._getTraits().email || 'No Identity Set');

    analytics.on('page', (event, properties, options) => {
      const latest = self.log.get();
      latest.push(`Page: ${options.path}`);
      self.log.set(latest);
    });

    analytics.on('identify', (event, properties) => {
      const latest = self.log.get();
      latest.push(`Identify: ${properties.email}`);
      self.log.set(latest);
      self.currentIdentity.set(properties.email);
    });

    analytics.on('track', (event) => {
      const latest = self.log.get();
      latest.push(`Track: ${event}`);
      self.log.set(latest);
    });
  });

  Template.mainLayout.helpers({
    log() { return Template.instance().log.get(); },
    currentIdentity() { return Template.instance().currentIdentity.get(); },
    isOauth() {
      const user = Meteor.user();
      let message = 'Not Signed In.';
      if (user && user.services) {
        if (user.services.facebook) {
          message = `Signed in with Facebook as ${user.services.facebook.name} (${user.services.facebook.email})`;
        } else if (user.services.github) {
          message = `Signed in with Github as ${user.services.github.username} (${user.services.github.email})`;
        } else if (user.services.google) {
          message = `Signed in with Google as ${user.services.google.name} (${user.services.google.email})`;
        }
      } else if (user) {
        message = 'Not an oauth login';
      }
      return message;
    },
  });

  Template.mainLayout.onRendered(function mainLayoutOnRendered() {
    Tracker.autorun(() => {
      document.title = Router.current().route.getName();
    });
  });
}

if (Meteor.isServer) {
  Meteor.publish('oauthInfo', function publishOAuthInfo() {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          'services.facebook.name': 1,
          'services.facebook.email': 1,
          'services.github.username': 1,
          'services.github.email': 1,
          'services.google.name': 1,
          'services.google.email': 1,
        },
      },
    );
  });
}
