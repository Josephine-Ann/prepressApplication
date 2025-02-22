import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import WebViewer from '@pdftron/webviewer';
import { PrintJobContext } from '../../PrintJobInfoProvider';
import flattenAndSend from './Utils/flattenAndSend';
import DownloadModal from '../DownloadModal/DownloadModal';
import styles from './WebViewerPrintJob.module.css';

const WebViewerPrintJob = () => {
    const {
        getPage,
        sendEmailWithPDF,
        shouldFlattenAndSend,
        updateShouldFlattenAndSend,
        checkForAutomatedComments,
        getDiecutAndUpdateComments
    } = useContext(PrintJobContext);

    const { jobPDF } = useParams();

    const viewer = useRef(null);
    const hasBeenInitialized = useRef(false);
    const instanceRef = useRef(null);
    const email = useRef(null);

    useEffect(() => {
        if (shouldFlattenAndSend) {
            flattenAndSend(instanceRef, sendEmailWithPDF, updateShouldFlattenAndSend);
        }
    }, [shouldFlattenAndSend]);

    useEffect(() => {
        getPage();
        if (!hasBeenInitialized.current && jobPDF) {
            hasBeenInitialized.current = true;
            WebViewer(
                {
                    initialZoom: 100,
                    path: 'webviewer',
                    licenseKey: process.env.REACT_APP_WEBVIEWER_LICENSE_KEY,
                    initialDoc: `packaging_images/${jobPDF}`
                },
                viewer.current
            ).then(async (instance) => {
                const { Core: { Annotations, annotationManager, documentViewer } } = instance;

                documentViewer.zoomTo(1);
                instanceRef.current = instance;

                let x = 10;
                let y = 10;
                const toAddAndRedraw = [];

                const createAutomatedAnnotation = (author, textContent) => {
                    const textAnnotation = new Annotations.FreeTextAnnotation(Annotations.FreeTextAnnotation.Intent.FreeText, {
                        PageNumber: 1,
                        X: x,
                        Y: y,
                        Width: 200,
                        Height: 170,
                        TextAlign: 'center',
                        TextVerticalAlign: 'center',
                        FillColor: new Annotations.Color(255, 255, 255, 1),
                        TextColor: new Annotations.Color(0, 0, 0, 1),
                        StrokeColor: new Annotations.Color(0, 0, 0, 1),
                        Author: author,
                        LocalStorage: false
                    });
                    textAnnotation.setContents(textContent);
                    toAddAndRedraw.push(textAnnotation);
                };

                let { manager, errors, opening, closing } = await checkForAutomatedComments(jobPDF);
                errors = await getDiecutAndUpdateComments(jobPDF, errors);
                errors.unshift(manager);

                errors.forEach((annot, i) => {
                    const author = i === 0 ? 'Manager' : 'Prepress';
                    createAutomatedAnnotation(author, annot);
                    if (x >= 200) {
                        x = 10;
                        y += 250;
                    } else {
                        x += 250;
                    }
                });

                annotationManager.addAnnotations(toAddAndRedraw);
                annotationManager.drawAnnotations({ pageNumber: 1, majorRedraw: true });

                errors.shift();
                email.current = { errors, opening, closing, manager };
            });
        }

        return () => {
            if (viewer.current) {
                viewer.current.innerHTML = '';
            }
        };
    }, [jobPDF]);

    return (
        <div id={styles.background}>
            <DownloadModal jobPDF={jobPDF} email={email} />
            <div className={styles.webviewer} ref={viewer}></div>
        </div>
    );
};

export default WebViewerPrintJob;
