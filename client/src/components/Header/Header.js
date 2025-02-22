import React, { useContext } from 'react';
import { PrintJobContext } from '../../PrintJobInfoProvider';
import { getCSSClassesBasedOnEmptyPath, getCSSClassesBasedOnPath, allClassesH1, allClassesExportButton, allClassesDivSearchContent } from './Utils/getCSSClassesBasedOnPath';
import goToList from './Utils/goToList';
import styles from './Header.module.css';

const Header = () => {
  const {
    openOrCloseModal,
    filterPrintJobs,
    selectedStatus,
    currentPage
  } = useContext(PrintJobContext);

  const currentClassH1 = getCSSClassesBasedOnEmptyPath(currentPage, allClassesH1.classTrue, allClassesH1.classFalse);
  const currentClassExportButton = getCSSClassesBasedOnEmptyPath(currentPage, allClassesExportButton.classTrue, allClassesExportButton.classFalse);
  const currentClassDivSearchContent = getCSSClassesBasedOnPath(currentPage, allClassesDivSearchContent.classTrue, allClassesDivSearchContent.classFalse);

  return (
    <header className={styles.appHeader}>
      <h1 className={currentClassH1} onClick={goToList}>Legacy Litho Printworks</h1>
      <button id="exportBtn" onClick={openOrCloseModal} className={currentClassExportButton}>
        Ask Client to Resend
      </button>
      <div className={currentClassDivSearchContent}>
        <select
          onChange={(e) => filterPrintJobs(e.target.value)}
          value={selectedStatus}
          className={styles.statusDropdown}
        >
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="waiting for customer information">Waiting for Customer Info</option>
          <option value="complete">Complete</option>
          <option value="all">All</option>
        </select>
        <input
          type="text"
          className={styles.inputHeader}
          placeholder="Filter by Client Name"
          onChange={(e) => filterPrintJobs('', e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;
