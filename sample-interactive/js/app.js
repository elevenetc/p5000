import {isMobile} from "../../src/p5000/utils/isMobile";

function loadMobileApp() {
    document.documentElement.classList.add('mobile');
    import('./mobile-app.js').catch(err => {
        console.error('Failed to load mobile app', err);
    });
}

function loadDesktopApp() {
    document.documentElement.classList.remove('mobile');
    import('./canvas-app.js').catch(err => {
        console.error('Failed to load canvas app', err);
    });
}

if (isMobile()) {
    loadMobileApp();
} else {
    loadDesktopApp();
}