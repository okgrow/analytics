# Complete analytics integration for Meteor
Use one API thanks to Segment.io's [analytics.js](https://segment.com/docs/libraries/analytics.js/) to record and send your data from your Meteor app to your analytics platforms.

## Analytics 2.1.0+
Our Analytics package has been rewritten to be router agnostic. You should be able to use this package with any router that you use with Meteor app. We have tested and used our Analytics package with iron-router, flow-router, and react-router. You can view and test this out in our iron-router, flow-router and react-router example apps located in the `examples` folder.

**NOTE**: A fundamental change that may affect some applications is that we no longer look for or use the router's route name when logging page views. Instead we use `document.title`. This may affect applications that do not change or set their `document.title` for each screen or page of their application. The simplest solution is to simply set document title like this `document.title = "My new title";` for each screen or page in your application. If you are using `flow router` or `iron router` you can remain at `okgrow:analytics@2.0.1` to keep using the `name` of the route for your analytic events.

### Pre Meteor 1.3.1
For Meteor Apps older than v1.3.1, please use [v1.0.9](https://github.com/okgrow/analytics/releases/tag/v1.0.9) of this package. Going forward this package will officially only be supporting Meteor Apps >= v1.3.1

## Installation

`> meteor add okgrow:analytics`

## Currently Supported Analytic Services
* Amplitude
* Chartbeat
* comScore
* Google Analytics
* HubSpot
* Intercom
* Keen IO
* KISSmetrics
* Mixpanel
* Quantcast
* Segment.io

## Ad-blocker

Whilst running your Meteor App in "development mode" any ad-blocking web-browser extensions may block the entire "okgrow:analytics" package. This occurs due to the word "analytics" being used in the package name.

Please note this only occurs when running Meteor in "development mode" due to the files not being bundled together and minified. To work around this issue you can disable your ad-blocker whilst developing.

To test that your application runs whilst an ad-blocker is enabled you can run your Meteor app with the following command:

`meteor run --production --settings settings.json`

**NOTE:** If an Adblocker is enabled the expected behaviour is that your analytic events will not be received. You will see an error message in your console reporting the events being blocked.

## Configuration

Add various platforms by adding each tool's configuration to your `settings.json` file:

```
{
  "public": {
    "analyticsSettings": {
      // Add your analytics tracking ids here (remove this line before running)
      "Google Analytics" : {"trackingId": "Your tracking ID"},
      "Amplitude"        : {"apiKey": "..."},
      "Chartbeat"        : {"uid": "..."},
      "comScore"         : {"c2": "..."},
      "HubSpot"          : {"portalId": "..."},
      "Intercom"         : {"appId": "..."},
      "Keen IO"          : {"projectId": "...", "writeKey": "..."},
      "KISSmetrics"      : {"apiKey": "..."},
      "Mixpanel"         : {"token":  "...", "people": true},
      "Quantcast"        : {"pCode": "..."},
      "Segment.io"       : {"apiKey": "..."}
    }
  }
}
```

It's important to note that service names and API key-names provided above are specific to the platform. Make sure to use the correct service name and key shown for the platform you're adding.

There are other options which we haven't documented here yet, to see them search for your specific integration [in this file](https://github.com/okgrow/analytics.js/blob/master/analytics.js) and look at the options and their defaults that are set with `.option(...)`.

If you use a different service for tracking events or page views and you think it's popular enough that we should add it then please open an issue on the repo and we'll see how many supporters we get. Each additional integration adds a small amount to the file size so we would like to support only the most common ones.

### Page views

Compatible with any router,
this package will log page views automatically. The page is
logged with the follow parameters:

 * `path`: path part of the URL
 * `title`: the page's title
 * `url`: hostname + path
 * `search`: the URL's query string, if provided. blank otherwise
 * `referrer`: hostname + old path, if coming from a previous route

To disable automatic page view tracking change `Meteor.settings` as shown below then manually log a page view by calling `analytics.page('page name')`:

```
{
  "public": {
    "analyticsSettings": {
      // Disable autorun if you do not want analytics running on every route (remove this line before running)
      "autorun"  : false
    }
  }
}
```

### Log signin/signout

If you have the `accounts` package installed, this package will automatically track when a user logs in and logs out. Logging in will call `identify` on the user and associate their `Meteor.userId` to their previous anonymous activities.

### Event tracking

Add tracking on any event simply by calling the `analytics.track()` function:

```
analytics.track("Bought Ticket", {
  eventName: "Wine Tasting",
  couponValue: 50,
});
```

Check Segment.io's [analytics.js track documentation](https://segment.com/docs/libraries/analytics.js/#track) for a full description of `track()` and all the other functions available in this package.

### Track visitor scrolling

Josh Owens' article, [Google Analytics events, goals, and Meteor.js](http://joshowens.me/google-analytics-events-goals-and-meteor-js/), goes over a great way to capture how far a visitor has scrolled down a page.

### Browser Policy

If your project uses the [Browser Policy package](https://atmospherejs.com/meteor/browser-policy), we've included the Google Analytics & Mixpanel domains in our browser policy configuration. Any additional services you add will need to be added to your browser policy config as well.

###### example
```
// file: lib/browser-policy.js

BrowserPolicy.content.allowOriginForAll("www.google-analytics.com");
BrowserPolicy.content.allowOriginForAll("cdn.mxpnl.com");
```

If your project doesn't use this package, then don't worry as it will not affect your usage.

### Debugging

When adding your platforms and setting events to track, you'll probably want to keep debug on locally. This will log all the analytics package's activity to the console.
In the console:
`> analytics.debug()`

Turn debug off with `analytics.debug(false)`

### URL Whitelisting on Android Devices

If your app is running on Android devices you will probably have to add the `cordova-plugin-whitelist` package and set access rules in your `mobile-config.js` for all URLs of the platforms that you are using.

Example for Intercom:
```
App.accessRule('https://js.intercomcdn.com/*');
App.accessRule('https://static.intercomcdn.com/*');
App.accessRule('https://api-iam.intercom.io/*');
App.accessRule('https://widget.intercom.io/*');
App.accessRule('https://nexus-websocket-a.intercom.io/*');
App.accessRule('https://nexus-websocket-b.intercom.io/*');
```

To find all the necessary URLs for your project, build your production app and install it on your Android device. Then connect it via USB and open the Android Studio Device Monitor (Tools >> Android Device Monitor >> LogCat). Perform a relevant action and then search for "whitelist". It should a show message for each URL that was blocked.


### Example Iron Router, Flow Router, and React Router

This repo includes an `examples` directory containing 3 simple apps using iron router, flow router and react router. These are just examples with common routers; it does not go to say that this plugin only works with these specific routers.
These apps must first be setup with `meteor npm install`, you can then run from their directory with `meteor --settings settings.json --production`.

### License

Released under the [MIT license](https://github.com/okgrow/analytics/blob/master/License.md).

### Contributing

Issues and Pull Requests are always welcome.
