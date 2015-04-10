if (Package["browser-policy-common"]) {
  var content = Package['browser-policy-common'].BrowserPolicy.content;
  if (content) {
    content.allowOriginForAll("www.google-analytics.com");
    content.allowOriginForAll("cdn.mxpnl.com");
  }
}
