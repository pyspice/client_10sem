import './App.global.css';
import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Main } from './pages';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  );
}
