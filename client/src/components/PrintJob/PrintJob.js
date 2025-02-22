import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrintJobContext } from '../../PrintJobInfoProvider';
import {
  checkAndGenerateThumbnail,
  getFromDB,
  saveToDB,
  openDB
} from './Utils/indexedDBCode';
import goToPrintJob from './Utils/goToPrintJob';

const PrintJob = ({ job }) => {
  const { updatePrintJob } = useContext(PrintJobContext);
  const [thumb, setThumb] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const DB_NAME = 'JoApryseThumbnails';
    const STORE_NAME = 'thumbnails';
    checkAndGenerateThumbnail(
      job.img.replace('.pdf', ''),
      DB_NAME,
      STORE_NAME,
      setThumb,
      getFromDB,
      saveToDB,
      openDB,
      job.img
    );
  }, [job.img]);

  useEffect(() => {
    job.thumbnail = thumb;
  }, [thumb, job]);

  return (
    <div className="print-job">
      <div className="img-container">
        <img className="thumbnail" src={thumb} alt={job.url} />
      </div>

      <div className="print-job-information">
        <button
          onClick={() => goToPrintJob(job.img, navigate)}
          style={{ border: '1px solid #826c6c6e', width: '15vw', height: '5vh', display: 'flex' }}
          className="print-job-button"
        >
          <p>{job.client}</p>
          <i className="fa-solid fa-square-up-right" />
        </button>

        <p className="print-job-text">Resolution: {job.resolutionInPPI}</p>
        <p className="print-job-text">{job.quantity} labels</p>
        <p className="print-job-text">{job.windings} windings</p>
        <p className="print-job-text">{job.substrateType} substrate</p>
        <p className="print-job-text">{job.dimensions} dimensions</p>
        <p className="print-job-text">{job.colorSpace}</p>
        <p className="print-job-text">{job.status}</p>
        <p className="print-job-text">Diecut {job.diecutCode}</p>

        <div className="input-fields-box">
          <input
            className="input-box-print-job"
            type="checkbox"
            id="medicalProduct"
            checked={job.isMedical}
          />
          <label className="print-job-text">Medical</label>
        </div>

        <div className="input-fields-box">
          <input
            className="input-box-print-job"
            type="checkbox"
            id="foodProduct"
            checked={job.isNutrition}
          />
          <label className="print-job-text">Food</label>
        </div>

        {job.status === 'new' && (
          <button
            className="print-job-button"
            style={{ border: '1px solid #826c6c6e', width: '15vw', height: '5vh' }}
            onClick={() => updatePrintJob(job.id, 'in-progress')}
          >
            <i className="fa-solid fa-clock" /> Begin Job
          </button>
        )}

        {job.status === 'in-progress' && (
          <>
            <button
              className="print-job-button"
              style={{ border: '1px solid #826c6c6e', width: '15vw', height: '5vh' }}
              onClick={() => updatePrintJob(job.id, 'waiting for customer information')}
            >
              <i className="fa-solid fa-square-phone" /> Request Info.
            </button>

            <button
              className="print-job-button"
              style={{ border: '1px solid #826c6c6e', width: '15vw', height: '5vh' }}
              onClick={() => updatePrintJob(job.id, 'complete')}
            >
              <i className="fa-solid fa-square-check" /> Mark as Complete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PrintJob;
