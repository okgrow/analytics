Meteor.publish(null, function() {
  if(this.userId) {
    return Meteor.users.find(
      {_id: this.userId},
      {fields: {  'services.facebook.email': 1,
                  'services.google.email': 1,
                  'services.github.email': 1,
  	              'registered_emails': 1
               }});
  } else {
    this.ready();
  }
});
