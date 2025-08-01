import { Outlet } from "react-router-dom";
import { Navigation } from "../components/index.js";

export function App() {
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
}

export default App;
