import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { analytics } from "./analytics-helpers.js";
import { SETTINGS } from "./client-common.js";
import { initIronRouter } from "./iron-router.js";
import { trackLogins, getUserEmail } from "./meteor-analytics.js";
import "./flow-router.js";

Meteor.startup(() => {
  if (SETTINGS) {
    initIronRouter();
    // FlowRouter handles its own initialisation. Funky things happen if you attempt,
    // to initialise inside of Meteor.startup()
    analytics.initialize(SETTINGS);
  } else {
    console.error("Missing analyticsSettings in Meteor.settings.public");
  }

  if (Package["accounts-base"]) {
    Tracker.autorun(function () {
      userEmail = getUserEmail();
    });
    Tracker.autorun(trackLogins);
  }
});

export { analytics };
