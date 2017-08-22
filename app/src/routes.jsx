import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Root from './containers/Root/Root';
import Home from './containers/Home/Home';
import Results from './containers/Results/Results';

export default () => (
  <Root>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/:id" component={Results} />
      </Switch>
    </BrowserRouter>
  </Root>
);
