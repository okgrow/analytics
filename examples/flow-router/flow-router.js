if (Meteor.isClient){
  FlowRouter.route('/one', {
    action: function(params) {
      FlowLayout.render("mainLayout", {main: "one"});
    },
    name: "SomeName" // used for track
  });
  FlowRouter.route('/two', {
    action: function(params) {
      FlowLayout.render("mainLayout", {main: "two"});
    },
    name: "AnotherName" // used for track
  });
  FlowRouter.route('/three') // without 'name', path is used for tracking
}
