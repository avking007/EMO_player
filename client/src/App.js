import Routes from "./Routes";
import { GlobalState } from "./Compenents/GlobalState";

function App() {
  return (
    <GlobalState>
      <Routes />
    </GlobalState>
  );
}

export default App;
