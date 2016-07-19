/* global Package */
// NOTE: As far as currently understood. Package is not accesiable as an import from meteor.

const _IronRouter = Package["iron:router"] && Package["iron:router"].Router;

const _FlowRouter =
  (Package["kadira:flow-router"] && Package["kadira:flow-router"].FlowRouter) ||
  (Package["meteorhacks:flow-router"] && Package["meteorhacks:flow-router"].FlowRouter) ||
  (Package["kadira:flow-router-ssr"] && Package["kadira:flow-router-ssr"].FlowRouter) ||
  (Package["meteorhacks:flow-router-ssr"] && Package["meteorhacks:flow-router-ssr"].FlowRouter);

export { _IronRouter, _FlowRouter };
