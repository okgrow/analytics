import { Tracker } from "meteor/tracker";
import { trackPageWhenReady } from "./analytics-helpers.js";
import { _IronRouter } from "./routers.js";
import { SETTINGS } from "./client-common.js";

const initIronRouter = function initIronRouter() {
  if (_IronRouter) {
    _IronRouter.onRun(function () {
      const router = this;
      if (SETTINGS.autorun !== false) {
        Tracker.afterFlush(function () { trackPageWhenReady(router.route.getName()); });
      }
      this.next();
    });
  }
};

export { initIronRouter };
