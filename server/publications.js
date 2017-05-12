import { Meteor } from 'meteor/meteor'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { Mongo } from 'meteor/mongo'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions

Meteor.publish(null, function analyticsUsersPublish() {
  if (this.userId) {
    const self = this;
    const query = Meteor.users
      .find({
        _id: this.userId,
      }, {
        fields: {
          emails: 1,
          'services.google.email': 1,
          'services.github.email': 1,
          'services.facebook.email': 1,
        },
      });
    Mongo.Collection._publishCursor(query, self, 'AnalyticsUsers');
    return self.ready();
  }

  this.ready();
});
