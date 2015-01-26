# okgrow:analytics
Simple analytics integration for meteor using [analytics.js](https://segment.com/docs/libraries/analytics.js/) under the hood. Use one API to record and send your data to various analytics platforms.

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
      "UserVoice"        : {"apiKey": "your api key"},
      "Sentry"           : {"config": "your config key"},
      "Segment.io"       : {"apiKey": "your api key"}
    }
  }
}
```

### Usage
==========================================================================
##### Default behaviour

We've built in some default behaviour that will be there if you've got common packages installed:

###### log signin/singout  
If you have the `accounts` package installed, you'll automatically track when a user logs in and logs out

###### automatic Iron Router page view tracking  
If you have `iron:router` installed, you'll automatically log page views using the route's `getName()` function

##### Event tracking

Add tracking on any events simply by calling the `analytics.track()` function:

```
analytics.track("Bought Ticket" {
  eventName: "Wine Tasting",
  couponValue: 50,
});
```

See the analytics.js documentation of the track function for a full description and all the other functions available in this package.

##### Debugging

When adding your platforms and setting events to track, you'll probably want to keep debug on locally. This will log all the analytics package's activity to the console.  
In the console:  
`> analytics.debug()`
