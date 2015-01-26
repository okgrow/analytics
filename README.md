# Complete analytics integration for Meteor
Use one API to record and send your data from your Meteor app to your analytics platforms using [analytics.js](https://segment.com/docs/libraries/analytics.js/) under the hood. 

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

> Q: Where are all the platforms that Segment.io/analytics.js support?  
A: The analytics.js open source project does support many additional platforms. The challenge is using the correct API key-name and any other required options. It's possible to inspect the analytics.js source code and find the API key-name for the service you're using. If you've used other services with the open-source codebase and can confirm the API options please submit a PR to update this example! 

#### Browser Policy

By default, we've included the Google Analytics & Mixpanel domains in [our browser policy configuration](https://atmospherejs.com/meteor/browser-policy). Any additional services you add will need to be added to your browser policy config as well.

###### example
```
// file: lib/browser-policy.js

BrowserPolicy.content.allowOriginForAll("www.google-analytics.com");
BrowserPolicy.content.allowOriginForAll("cdn.mxpnl.com");
```

## Usage

### Default behaviour

We've built in some default behaviour that will be there if you've got common packages installed:

###### log signin/signout  
If you have the `accounts` package installed, you'll automatically track when a user logs in and logs out

###### automatic Iron Router page view tracking  
If you have `iron:router` installed, you'll automatically log page views using the route's `getName()` function

### Event tracking

Add tracking on any events simply by calling the `analytics.track()` function:

```
analytics.track("Bought Ticket" {
  eventName: "Wine Tasting",
  couponValue: 50,
});
```

See the [analytics.js documentation of the track function](https://segment.com/docs/libraries/analytics.js/#track) for a full description and all the other functions available in this package.

### Debugging

When adding your platforms and setting events to track, you'll probably want to keep debug on locally. This will log all the analytics package's activity to the console.  
In the console:  
`> analytics.debug()`

Turn debug off with `analytics.debug(false)`
