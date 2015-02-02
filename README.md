# Complete analytics integration for Meteor
Use one API to record and send your data from your Meteor app to your analytics platforms. 

### Installation

`> meteor add okgrow:analytics`

### Configuration

Add various platforms by adding each tool's configuration to your `settings.json` file:

```
{
  "public": {
    "analyticsSettings": {
      // Add your analytics tracking id's here
      "Google Analytics" : {"trackingId": "Your tracking ID"},
      "Mixpanel"         : {"token": "your token"},
      "KISSmetrics"      : {"apiKey": "your api key"},
      "UserVoice"        : {"apiKey": "your api key"},
      "Sentry"           : {"config": "your config key"},
      "Segment.io"       : {"apiKey": "your api key"}
    }
  }
}
```

It's important to note that service names and API key-namess provided above are specific to the platform. Make sure to use the correct service name and key shown for the plaform you're adding.

> Q: What other analytics platforms are supported?  
A: This package uses the [analytics.js](https://segment.com/docs/libraries/analytics.js/) open source project under the hood which does support many additional platforms. The challenge is using the correct API key-name and any other required options. If you've used other services with the open-source codebase and can confirm the API options please submit a PR to update this example! 

#### Browser Policy

If your project uses the [Browser Policy package](https://atmospherejs.com/meteor/browser-policy), we've included the Google Analytics & Mixpanel domains in our browser policy configuration. Any additional services you add will need to be added to your browser policy config as well.

###### example
```
// file: lib/browser-policy.js

BrowserPolicy.content.allowOriginForAll("www.google-analytics.com");
BrowserPolicy.content.allowOriginForAll("cdn.mxpnl.com");
```

If your project doesn't use this package, then don't worry as it will not affect your usage.

## Usage

### Log signin/signout and page-views default behaviour

If you have the `accounts` package installed, this package will automatically track when a user logs in and logs out. Logging in will call identify on the user and associate their Meteor.userId to their previous anonymous activities.

If you have the 'iron:router' package installed, this package will automatically track page-view events using your routes' names.

If you do not use Iron Router, manually logging page views looks like this: `analytics.page('page name')`

### Event tracking

Add tracking on any event simply by calling the `analytics.track()` function:

```
analytics.track("Bought Ticket" {
  eventName: "Wine Tasting",
  couponValue: 50,
});
```

See the [analytics.js track documentation](https://segment.com/docs/libraries/analytics.js/#track) for a full description of `track()` and all the other functions available in this package.

#### Track visitor scrolling

Josh Owens' article, [Google Analytics events, goals, and Meteor.js](http://joshowens.me/google-analytics-events-goals-and-meteor-js/), goes over a great method on tracking page-scroll percentage. 

### Debugging

When adding your platforms and setting events to track, you'll probably want to keep debug on locally. This will log all the analytics package's activity to the console.  
In the console:  
`> analytics.debug()`

Turn debug off with `analytics.debug(false)`
