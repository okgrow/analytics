Package.describe({
  name: 'okgrow:analytics',
  version: '0.3.0',
  // Brief, one-line summary of the package.
  summary: 'Complete Google Analytics, Mixpanel, KISSmetrics (and more) integration for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/okgrow/analytics',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('accounts-base', ['client', 'server'], {weak: true});
  api.use('browser-policy-content', 'server', {weak: true});
  api.use('iron:router@1.0.7', 'client', {weak: true});
  api.use('kadira:flow-router@2.0.0', 'client', {weak: true});
  api.addFiles('lib/browser-policy.js', 'server');
  api.addFiles('lib/server/publications.js', 'server');
  api.addFiles([
    'lib/config.js',
    'vendor/analytics.min.js',
    'lib/meteor-analytics.js'
  ], 'client');
});
