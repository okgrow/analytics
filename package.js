Package.describe({
  name: 'okgrow:analytics',
  version: '3.0.2',
  summary: 'Extends @okgrow/auto-analytics adding automatic user identification for Meteor applications.',
  git: 'https://github.com/okgrow/analytics',
  documentation: 'README.md',
});

Package.onUse((api) => {
  // NOTE: symlink with example app causes error, upgrade to 1.3.2 or higher
  // to run the examples. https://github.com/meteor/meteor/issues/6665
  api.versionsFrom('1.3.1');

  // "ecmascript" is mandatory dependency to compile our package's es6 code.
  api.use('ecmascript');
  // "es5-shim" adds better es5 support for legacy browsers.
  api.use('es5-shim');

  // weak dependencies indicate we will load after the following packages.
  api.use('accounts-base', ['client', 'server'], { weak: true });
  api.use('browser-policy-content', 'server', { weak: true });

  // Client and server entry points
  api.mainModule('client/main.js', 'client');
  api.mainModule('server/main.js', 'server');

  // For backward compatibility, pre import/export syntax
  api.export('analytics', ['client', 'server']);
});

Npm.depends({
  '@okgrow/auto-analytics': '1.0.3',
});
