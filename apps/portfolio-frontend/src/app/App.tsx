import { Outlet } from "react-router-dom";
import { Navigation } from "../components";

export function App() {
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
}

export default App;
