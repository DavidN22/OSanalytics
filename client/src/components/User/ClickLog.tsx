import { useAtom } from 'jotai';
import styles from './ClickLog.module.css';

import ClickLogItem from './ClickLogItem';
import { userDataAtom } from '../../state/Atoms';
import { mapUserData } from '../../services/extractData';

function ClickLog() {
  const [userData] = useAtom(userDataAtom);
  const mappedData: any = mapUserData(userData);

  const displayedItems = [];

  if (Array.isArray(mappedData)) {
    for (let i = mappedData.length - 1; i >= Math.max(mappedData.length - 10, 0); i--) {
      if (mappedData[i]) {
        displayedItems.push(<ClickLogItem item={mappedData[i]} key={i} />);
      }
    }
  }
    
  return (
    <div className={styles.ClickLog}>
      <div className="admin-header">
        <h2>Recent User Interactions</h2>
      </div>

      <table className={styles.ClickLogItems}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Interaction</th>
            <th>Element</th>
            <th>Browser</th>
            <th>OS</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
{displayedItems}
        </tbody>
      </table>
    </div>
  );
}

export default ClickLog;
