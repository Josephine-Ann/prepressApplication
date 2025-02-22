const flattenAndSend = async (instanceRef, sendEmailWithPDF, updateShouldFlattenAndSend) => {
    const {
        annotationManager,
        documentViewer
    } = instanceRef.current.Core;
    const xfdfString = await annotationManager.exportAnnotations();
    const doc = documentViewer.getDocument();
    const options = {
        xfdfString,
        flatten: true
    };
    const data = await doc.getFileData(options);
    const blob = new Blob([data], {
        type: 'application/pdf'
    });
    sendEmailWithPDF(blob);
    updateShouldFlattenAndSend(false);
};

export default flattenAndSend;