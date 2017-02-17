// Entry point
import './startup';

// Make analytics available as an export
import analytics from '../vendor/analytics.min';

import { trackEventWhenReady, trackPageWhenReady, identifyWhenReady } from './helpers';

export { analytics, trackEventWhenReady, trackPageWhenReady, identifyWhenReady };
