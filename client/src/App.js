import Routes from "./Routes";
import { Provider } from "react-redux";
import { GlobalState } from "./Components/GlobalState";
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <GlobalState>
        <Routes />
      </GlobalState>
    </Provider>
  );
}

export default App;
