import { trackPageWhenReady } from "./analytics-helpers.js";
import { _FlowRouter } from "./routers.js";
import { SETTINGS } from "./client-common.js";

const autoRun = SETTINGS && SETTINGS.autorun !== false;

if (_FlowRouter && autoRun) {
  // something context & context.context don't exist, see: #93
  _FlowRouter.triggers.enter([function (context) {
    const page = {};

    if (context.path) {
      page.path = context.path;
    }
    if (context.context && context.context.title) {
      page.title = context.context.title;
    }

    page.url = window.location.origin + page.path;

    if (context.route && context.route.name) {
      page.name = context.route.name;
    } else {
      page.name = page.path;
    }
    if (context.context && context.context.querystring) {
      page.search = `? ${context.context.querystring}`;
    } else {
      page.search = "";
    }
    if (_FlowRouter.lastRoutePath) {
      page.referrer = window.location.origin + _FlowRouter.lastRoutePath;
    } else {
      page.referrer = document.referrer;
    }
    _FlowRouter.lastRoutePath = page.path;

    trackPageWhenReady(page.name, page);
  }]);
}
