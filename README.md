# okgrow:analytics
Simple analytics integration for meteor using [analytics.js](https://segment.com/docs/libraries/analytics.js/) under the hood.

### Installation

`> meteor add okgrow:analytics`

### Configuration

##### directly with analytics platforms:
In your `settings.json` file:

```
{
  "public": {
    "analyticsSettings": {
      "Google Analytics" : {"trackingId": "Your tracking ID"}
    }
  }
}
```

`#TODO: provide structure for Mixpanel & others`

##### directly with segment.io account:

`#TODO`

### Usage

##### Default behaviour

- log user signin/signout (if Accounts package is installed)
- log page view (if Iron Router package is installed)

##### Event logging

`analytics.track("Event name/description")`
