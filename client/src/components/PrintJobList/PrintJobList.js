import React, { useContext, useState, useEffect } from 'react';
import { PrintJobContext } from '../../PrintJobInfoProvider';
import PrintJob from '../PrintJob/PrintJob';
import handleResize from './Utils/handleResize';
import './PrintJobList.css';

const PrintJobList = () => {
  const { printJobList, filterPrintJobs, getPage } = useContext(PrintJobContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resizeHandler = () => handleResize(setIsMobile, filterPrintJobs);
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [filterPrintJobs]);

  useEffect(() => {
    getPage();
  }, [getPage]);

  return (
    <div className="print-job-list">
      {isMobile ? (
        <div className="column">
          {printJobList && printJobList.map((job) => (
            <PrintJob key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="columns">
          {printJobList && printJobList.map((job) => (
            <PrintJob key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrintJobList;
