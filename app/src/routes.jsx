import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Root from './containers/Root/Root';
import Home from './containers/Home/Home';
import CDN from './containers/CDN/CDN';
import Results from './containers/Results/Results';

export default () => (
  <Root>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/result/:id" component={Results} />
        <Route path="/cdn/:id" component={CDN} />
      </Switch>
    </HashRouter>
  </Root>
);
