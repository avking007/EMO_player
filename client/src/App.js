import Routes from "./Routes";
import { GlobalState } from "./Components/GlobalState";

function App() {
  return (
    <GlobalState>
      <Routes />
    </GlobalState>
  );
}

export default App;
