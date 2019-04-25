import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import Asset from './components/asset';
import Market from './components/market';
import NotFound from './components/notFound';
import * as serviceWorker from './serviceWorker';
import metamask from './utils/provider';

metamask();

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/asset/:simbol" component={Asset} />
	<Route path="/markets" component={Market} />
	<Route component={NotFound} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
