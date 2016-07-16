import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { analytics } from "./analytics-helpers.js";
import { SETTINGS } from "./client-common.js";
import { initIronRouter } from "./iron-router.js";
import { trackLogins, getUserEmail } from "./meteor-analytics.js";
import "./flow-router.js";

// TODO: Validate how to import from npm depends
// import _ from "underscore";

Meteor.startup(() => {
  if (!_.isEmpty(SETTINGS)) {
    if (SETTINGS.autorun !== false) {
      initIronRouter();
    }
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
