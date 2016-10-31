import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { SETTINGS } from "./constants";
import { trackLogins, getUserEmail } from "./meteor-analytics";
import { trackPageWhenReady } from "./helpers";
import analytics from "../vendor/analytics.min.js";

Meteor.startup(() => {
  if (SETTINGS) {
    analytics.initialize(SETTINGS);
    
    // Save reference to original pushState.
    const pushState = window.history.pushState;
    window.history.pushState = function(state) {
      if (typeof window.history.onpushstate == "function") {
        window.history.onpushstate({ title: document.title, referrer: location.href });
      }
      return pushState.apply(window.history, arguments);
    }
    
    window.addEventListener('popstate', function() {
      if (typeof window.history.onpushstate == "function") {
        window.history.onpushstate({ title: document.title, referrer: location.href });
      }
    }, false);
    
    window.history.onpushstate = function({ title, referrer }) {
      // Use defer so it doesnt use the previous location.
      Meteor.defer(() => {
        const page = {
          title,
          referrer,
          path: location.pathname,
          search: location.search,
          url: location.href
        };
        // Track page on analytics
        trackPageWhenReady(page.title, page);
      });
    }
    
  } else {
    console.error("Missing analyticsSettings in Meteor.settings.public");
  }

  if (Package["accounts-base"]) {
    Tracker.autorun(() => {
      userEmail = getUserEmail();
    });
    Tracker.autorun(trackLogins);
  }
});
