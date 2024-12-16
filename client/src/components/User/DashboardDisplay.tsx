import { usePopulateAtoms } from "../../services/populateAtoms";
import Dashboard from "./Dashboard";

function Final() {
  usePopulateAtoms();

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default Final;
