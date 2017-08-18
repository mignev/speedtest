import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Root from './containers/Root/Root';
import Home from './containers/Home/Home';

export default () => (
  <Root>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  </Root>
);
