Router.route('/one', function () {
  this.render('one');
});

Router.route('/two', function () {
  this.render('two');
},{analyticsDisable: true});

Router.route('/three', function () {
  this.render('three');
});