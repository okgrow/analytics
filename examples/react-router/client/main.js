import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { render } from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';
import { analytics } from "meteor/okgrow:analytics";
import { LoginButtons } from 'meteor/okgrow:accounts-ui-react';

import './main.html';

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      log: [],
      currentIdentity: `${analytics._user._getTraits().email}` || "No Identity Set"
    }

    analytics.on("page", (event, properties, options) => {
      const log = this.state.log;
      log.push(`Page: ${options.path}`);
      this.setState({ log })
    });

    analytics.on("identify", (event, properties, options) => {
      const log = this.state.log;
      log.push(`Identify: ${properties.email}`);
      this.setState({
        log,
        currentIdentity: `${properties.email}`,
      })
    });

    analytics.on("track", (event, properties, options) => {
      const log = this.state.log;
      log.push(`Track: ${event}`);
      this.setState({ log })
    });

    this.isOauth = this.isOauth.bind(this);
  }

  isOauth() {
    const user = Meteor.user();
    let message = "Not Signed In.";
    if (user && user.services) {
      if (user.services.facebook) {
        message = `Signed in with Facebook as ${user.services.facebook.name} (${user.services.facebook.email})`;
      } else if (user.services.github) {
        message = `Signed in with Github as ${user.services.github.username} (${user.services.github.email})`;
      } else if (user.services.google) {
        message = `Signed in with Google as ${user.services.google.name} (${user.services.google.email})`;
      }
    } else if (user) {
      message = "Not an oauth login";
    }
    return message;
  }

  render() {
    return (
      <div>
        <LoginButtons />

        <Link to='/one'>One</Link>
        <Link to='/two'>Two</Link>
        <Link to='/three'>Three</Link>
        <div>
          <h3>Current route</h3>
          {this.props.route.path}
        </div>
        <div>
          <h3>Current Identity</h3>
          {this.state.currentIdentity}
        </div>
        <div>
          <h3>OAuth Integration</h3>
          {
            Meteor.user()
              ? (<p>{this.isOauth()}</p>)
              : (<p>Not signed in</p>)
          }
        </div>
        <div>
          <h3>Latest Analytics Logged</h3>
          <ul>
            {
              this.state.log.map(l => (
                <li key={Random.id()}>{l}</li>
              ))
            }
          </ul>
        </div>
        <p>Want to see more detail? Call <code style={{backgroundColor: 'blueviolet', padding: 4, color: 'white'}}>analytics.debug()</code> in the browser console and refresh.</p>
      </div>
    );
  }
}

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App } />
      <Route path="/one" component={ App } />
      <Route path="/two" component={ App } />
      <Route path="/three" component={ App } />
    </Router>,
    document.getElementById( 'render-target' )
  );
});
