// TODO: Need a non-Meteor way to do this!
import { Meteor } from "meteor/meteor";

const SETTINGS = Meteor.settings && Meteor.settings.public &&
                 Meteor.settings.public.analyticsSettings || false;

export { SETTINGS };
