import {isMobile} from "../../src/p5000/utils/isMobile";

function loadMobileApp() {
    import('./mobile-app.js').catch(err => {
        console.error('Failed to load canvas app', err);
    });
}

function loadDesktopApp() {
    import('./canvas-app.js').catch(err => {
        console.error('Failed to load canvas app', err);
    });
}

if (isMobile()) {
    loadMobileApp();
} else {
    //loadDesktopApp();
    loadMobileApp();
}