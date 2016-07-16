import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

Meteor.publish(null, function () {
  if (this.userId) {
    const self = this;
    const query = Meteor.users
      .find({
        _id: this.userId,
      }, {
        fields: {
          emails: 1,
          "services.google.email": 1,
          "services.github.email": 1,
          "services.facebook.email": 1,
        },
      });
    Mongo.Collection._publishCursor(query, self, "AnalyticsUsers");
    return self.ready();
  }
  this.ready();
});
