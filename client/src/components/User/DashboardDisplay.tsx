import { Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import populateAtoms from "../../services/populateAtoms";
import { userDataAtom } from "../../state/Atoms";
import Dashboard from "./Dashboard";

function Final() {
  populateAtoms();
  const [data] = useAtom(userDataAtom);

  if (data.length === 0) {
    return <Navigate to="/docs" />;
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default Final;
