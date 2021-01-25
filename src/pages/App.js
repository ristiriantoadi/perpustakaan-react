import { Switch, Route, HashRouter } from 'react-router-dom';
import { GlobalProvider } from '../utils/GlobalState';
import Home from './home/Home';
import Login from './login/Login';
import Register from './register/Register';
import './App.css';

export default function App() {
  return (
    <GlobalProvider>
      <HashRouter basename='/'>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/home' component={Home} />
        </Switch>
      </HashRouter>
    </GlobalProvider>
  );
}
