
export const loadWebViewerCore = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/webviewer/core/webviewer-core.min.js';
        script.onload = () => resolve('WebViewer core script loaded successfully.');
        script.onerror = () => reject('Failed to load WebViewer core script.');
        document.body.appendChild(script);
    })
};
