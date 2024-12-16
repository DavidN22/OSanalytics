import { useRef, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { useAtom } from 'jotai';
import { timeFrameAtom } from '../../../state/Atoms';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from '../Charts.module.css';
import { filterDataByTimeFrame } from "../../../services/filterDataByTimeFrame ";
import { NoKeywordChart } from "../../../../types";
import ChartDownload from '../ChartDownload';
import { useEffect } from 'react';
ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ScatterChart = ({ data }: NoKeywordChart) => {
  const [timeFrame] = useAtom(timeFrameAtom);
  const chartRef = useRef(null);

  const filteredData = filterDataByTimeFrame(data, timeFrame);

  const uniquePages = Array.from(new Set(filteredData.map((item) => item.page_url)));
  const [selectedPage, setSelectedPage] = useState<string>(uniquePages[0] || '');
  
  useEffect(() => {
    if (!uniquePages.includes(selectedPage)) {
      setSelectedPage(uniquePages[0] || '');
    }
  }, [uniquePages, selectedPage]);

 
  const scatterData = {
    datasets: [
      {
        label: 'User Clicks',
        data: filteredData
          .filter((item) => item.page_url === selectedPage)
          .map((item) => ({
            x: item.x_coord,
            y: item.y_coord,
          })),
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        pointRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'X Coordinate (0-1)',
        },
      },
      y: {
        min: 0,
        max: 1,
        reverse: true,
        title: {
          display: true,
          text: 'Y Coordinate (0-1)',
        },
      },
    },
  };

  return (
    <div className={styles.chartBox} style={{ padding: '20px', margin: 'auto', textAlign: 'center' }}>
      <h3 style={{ color: 'black', textAlign: 'center', marginBottom: '20px' }}>Scatter Heatmap</h3>
      
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="pageFilter" style={{ marginRight: '10px' }}>Filter by Page:</label>
        <select
          id="pageFilter"
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          style={{ padding: '5px' }}
        >
          {uniquePages.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
      </div>

      <Scatter ref={chartRef} data={scatterData} options={options} />
      
      <div>
        <ChartDownload chartRef={chartRef} />
      </div>
    </div>
  );
};

export default ScatterChart;
