import styles from '../Header.module.css';

export function getCSSClassesBasedOnEmptyPath(currentPage, classTrue, classFalse) {
    return currentPage !== 'http://localhost:4000/' ? classTrue : classFalse;
}
export function getCSSClassesBasedOnPath(currentPage, classTrue, classFalse) {
    return currentPage === 'http://localhost:4000/' ? classTrue : classFalse;
}
export const allClassesH1 = {
    classTrue: `${styles.companyLogo} ${styles.companyLogoCursor}`,
    classFalse: styles.companyLogo
};
export const allClassesExportButton = {
    classTrue: styles.sendRevisalButton,
    classFalse: styles.webviewer
};
export const allClassesDivSearchContent = {
    classTrue: `${styles.list} ${styles.inputFieldsContainer}`,
    classFalse: styles.webviewer
};
