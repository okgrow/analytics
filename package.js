Package.describe({
  name: 'okgrow:analytics',
  version: '0.4.4',
  summary: 'Complete Google Analytics, Mixpanel, KISSmetrics (and more) integration for Meteor',
  git: 'https://github.com/okgrow/analytics',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('accounts-base', ['client', 'server'], {weak: true});
  api.use('browser-policy-content', 'server', {weak: true});

  //weak dependencies indicate we will load after the following packages
  // and constrain their versions IF another package, or app brings them in
  api.use('iron:router@1.0.7', 'client', {weak: true});
  api.use('meteorhacks:flow-router@1.17.2', 'client', {weak: true});
  api.use('kadira:flow-router@2.6.0', 'client', {weak: true});

  api.addFiles('lib/browser-policy.js', 'server');
  api.addFiles('lib/server/publications.js', 'server');
  api.addFiles([
    'lib/config.js',
    'vendor/analytics.min.js',
    'lib/meteor-analytics.js'
  ], 'client');
});
