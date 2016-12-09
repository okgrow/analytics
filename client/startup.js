import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { SETTINGS } from './constants';
import { trackLogins, getUserEmail } from './meteor-analytics';
import { trackPageWhenReady } from './helpers';
import analytics from '../vendor/analytics.min';

const logPageLoad = (title, referrer) => {
  // Use setTimeout so it uses the location from after the route change
  setTimeout(() => {
    const page = {
      title,
      referrer,
      path: location.pathname,
      search: location.search,
      url: location.href,
    };

    // Track page on analytics
    trackPageWhenReady(page.title, page);
  }, 0);
};

const logFirstPageLoad = () => {
  logPageLoad(document.title, document.referrer);
};

const configurePageLoadTracking = () => {
  const fireOnPushState = () => {
    try {
      logPageLoad({ title: document.title, referrer: location.href });
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  // Save reference to original pushState.
  const originalPushState = window.history.pushState;

  // Wrap original pushState to call new push state function
  // NOTE: this can't be an arrow function!
  window.history.pushState = function okgrowAnalyticsMonkeyPatchedPushState(...args) {
    fireOnPushState();

    // Call original pushState with incoming arguments
    return originalPushState.apply(window.history, args);
  };

  window.addEventListener('popstate', () => {
    fireOnPushState();
  }, false);
};

Meteor.startup(() => {
  if (SETTINGS) {
    analytics.initialize(SETTINGS);
    logFirstPageLoad();
    configurePageLoadTracking();
  } else {
    console.error('Missing analyticsSettings in Meteor.settings.public'); // eslint-disable-line no-console
  }

  if (Package['accounts-base']) {
    Tracker.autorun(() => {
      userEmail = getUserEmail();
    });
    Tracker.autorun(trackLogins);
  }
});
