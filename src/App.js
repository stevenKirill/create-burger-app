import BurgerBuilder from '../src/components/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from '../src/containers/Orders/Orders';
import Auth from '../src/containers/Auth/Auth';
import Toolbar from '../src/components/Navigation/ToolBar/Toolbar';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {useState} from 'react';
import './App.css';

function App() {
  const [signedIn,setSignedIn] = useState(false);

  function update() {
    setSignedIn((prev => !prev))
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Toolbar signedIn={signedIn} setSignedIn={setSignedIn}/>
        <Switch>
          <Route path="/checkout" component={Checkout}/>
          <Route path="/orders" component={Orders}/>
          <Route path="/burger" component={BurgerBuilder}/>
          <Route path="/" component={() => <Auth func={update}/>}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
