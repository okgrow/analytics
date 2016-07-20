Package.describe({
  name: "okgrow:analytics",
  version: "1.1.0",
  summary: "Complete Google Analytics, Mixpanel, KISSmetrics (and more) integration for Meteor",
  git: "https://github.com/okgrow/analytics",
  documentation: "README.md",
});

Package.onUse(function (api) {
  api.versionsFrom("1.3.1");

  // "ecmascript" is mandatory dependency to compile our package's es6 code.
  api.use("ecmascript");
  // "es5-shim" adds better es5 support for legacy browsers.
  api.use("es5-shim");

  // weak dependencies indicate we will load after the following packages.
  api.use("accounts-base", ["client", "server"], { weak: true });
  api.use("browser-policy-content", "server", { weak: true });

  // constrain their versions IF another package, or app brings them in.
  // Below packages will cause constraint conflicts in Meteor Apps < 1.3.1
  // Please use v1.0.9 https://github.com/okgrow/analytics/releases/tag/v1.0.9
  // for Meteor Apps < 1.3.1
  api.use("iron:router@1.0.7", "client", { weak: true });
  api.use("meteorhacks:flow-router@1.17.2", "client", { weak: true });
  api.use("kadira:flow-router@2.6.0", "client", { weak: true });

  try {
    api.mainModule("client-main.js", "client");
    api.mainModule("server-main.js", "server");
  } catch (e) {
    // We supress and ignore error for backwards compatibility for apps < 1.3.1,
    // reference to issue here https://github.com/meteor/meteor/issues/6713
  }
  // For backward compatibility.
  api.export("analytics", ["client", "server"]);
});
