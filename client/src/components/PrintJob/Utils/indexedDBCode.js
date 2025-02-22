import { loadWebViewerCore } from '../../utils/loadWebViewerCore';

export function openDB(DB_NAME, STORE_NAME) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = () => reject("Error opening database");
    });
}
;
export async function getFromDB(key, DB_NAME, STORE_NAME) {
    const db = await openDB(DB_NAME, STORE_NAME);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error retrieving data");
    });
}
;
export async function saveToDB(key, value, openDB, STORE_NAME, img) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.put(value, key);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject("Error saving data");
    });
}
;
export async function checkAndGenerateThumbnail(key, DB_NAME, STORE_NAME, setThumb, getFromDB, saveToDB, openDB, img) {
    const existingThumbnail = await getFromDB(key, DB_NAME, STORE_NAME);
    if (existingThumbnail) {
        setThumb(existingThumbnail);
        return;
    }
    loadWebViewerCore().then(res => {
        const getThumbnail = async thumb => {
            const CoreControls = window.Core;
            CoreControls.setWorkerPath("/webviewer/core");
            const doc = await CoreControls.createDocument(thumb, {
                l: process.env.REACT_APP_WEBVIEWER_LICENSE_KEY,
                extension: "pdf"
            });
            await doc.loadCanvas({
                pageNumber: 1,
                drawComplete: thumbnail => {
                    const res = thumbnail.toDataURL();
                    setThumb(res);
                    saveToDB(key, res, openDB, STORE_NAME).then(() => {
                        console.log("Thumbnail saved in DB:", key);
                    });
                }
            });
        };
        getThumbnail(`packaging_images/${img}`);
    });
}
;