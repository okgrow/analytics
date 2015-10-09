if (Meteor.isClient) {

  var firstLevelRoutes = FlowRouter.group({
    name: 'First Level Group',
    prefix: '/first-level'
  });

  var secondLevelRoutes = firstLevelRoutes.group({
    name: 'Second Level Group',
    prefix: '/second-level'
  });

  var thirdLevelRoutes = secondLevelRoutes.group({
    name: 'Third Level Group',
    prefix: '/third-level'
  });

  firstLevelRoutes.route('/', {
    name: 'First Level Route',
    action: function(params) {
      BlazeLayout.render("mainLayout", {main: "firstLevel"});
    }
  });

  secondLevelRoutes.route('/', {
    name: 'Second Level Route',
    action: function(params) {
      BlazeLayout.render("mainLayout", {main: "secondLevel"});
    }
  });

  thirdLevelRoutes.route('/', {
    action: function(params) {
      BlazeLayout.render("mainLayout", {main: "thirdLevel"});
    }
  }); // without 'name', path is used for tracking

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
}
