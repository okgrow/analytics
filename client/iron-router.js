import { Tracker } from "meteor/tracker";
import { trackPageWhenReady } from "./helpers";
import { _IronRouter } from "./routers";
import { SETTINGS } from "./constants";

const initIronRouter = function initIronRouter() {
  if (_IronRouter) {
    _IronRouter.onRun(function ironRouterOnRun() {
      const router = this;
      if (SETTINGS.autorun !== false) {
        Tracker.afterFlush(() => {
          trackPageWhenReady(router.route.getName());
        });
      }
      this.next();
    });
  }
};

export { initIronRouter };
