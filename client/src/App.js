import Routes from "./Routes";
import { Provider } from "react-redux";
import { GlobalState } from "./Components/GlobalState";
import store from './store';
import { useEffect } from "react";
import { loadUser } from "./actions/auth";

const App = () => {
  
  // load user on app load if token present
  useEffect(() => {
    store.dispatch(loadUser());
  }, [])

  return (
    <Provider store={store}>
      <GlobalState>
        <Routes />
      </GlobalState>
    </Provider>
  );
}

export default App;
