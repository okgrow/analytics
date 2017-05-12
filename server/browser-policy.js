/* global Package */

if (Package['browser-policy-common']) {
  const content = Package['browser-policy-common'].BrowserPolicy.content;
  if (content) {
    content.allowOriginForAll('https://www.google.com/analytics/');
    content.allowOriginForAll('https://cdn.mxpnl.com');
  }
}
