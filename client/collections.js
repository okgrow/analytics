import { Mongo } from "meteor/mongo";

const AnalyticsUsers = new Mongo.Collection("AnalyticsUsers");

export { AnalyticsUsers };
