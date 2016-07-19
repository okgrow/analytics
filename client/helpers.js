import analytics from "../vendor/analytics.min.js";

/*
* analytics.js might not have loaded it's integrations by the time we start
* tracking events, page views and identifies.
* So we can use these *WhenReady() functions to cause the action to be
* deferred until all the intgrations are ready.
* TODO consider whether we should export something like this, maybe provide
* our own api instead of just using analytics.js' api.
*/
const trackEventWhenReady = (...args) => {
  const _args = args;
  analytics.ready(() => analytics.track.apply(this, _args));
};

const trackPageWhenReady = (...args) => {
  const _args = args;
  analytics.ready(() => analytics.page.apply(this, _args));
};

const identifyWhenReady = (...args) => {
  const _args = args;
  analytics.ready(() => analytics.identify.apply(this, _args));
};

export { trackEventWhenReady, trackPageWhenReady, identifyWhenReady };
