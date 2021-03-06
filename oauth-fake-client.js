// intercept the URL out to the oauth service
var _launchLogin = Package.oauth.OAuth.launchLogin;
Package.oauth.OAuth.launchLogin = function (options) {

  var args = arguments;

  // Make sure a fake options implementation exists for the login service
  if (_getFakeOptionsFor[options.loginService]) {
    args = [_getFakeOptionsFor[options.loginService](options)];
  }

  return _launchLogin.apply(this, args);
};


var _getFakeOptionsFor = {
  'linkedin': function (options) {
    var loopbackLoginUrl;

    if (typeof URL === "function") {

      loopbackLoginUrl = new URL(options.loginUrl);

      // change the protocol to http so we can run a loopback without extra server
      // configuration
      loopbackLoginUrl.protocol = 'http';

      // precede the host with fake
      loopbackLoginUrl.pathname =
        'fake.' + loopbackLoginUrl.host + loopbackLoginUrl.pathname;

      // and loop back to the current app
      loopbackLoginUrl.host = new URL(Meteor.absoluteUrl()).host;

    }
    // a version for PhantomJS which has no function URL()
    else {
      loopbackLoginUrl = options.loginUrl.replace(/https?:\/\//, Meteor.absoluteUrl()+'fake.');
    }
    // override the loginUrl in the options
    options.loginUrl = loopbackLoginUrl.toString();

    return options;
  }

};
