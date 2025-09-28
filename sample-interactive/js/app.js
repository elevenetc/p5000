import {isMobile} from "../../src/p5000/utils/isMobile";

if (isMobile()) {
    window.location.replace('./mobile.html');
} else {
    import('./canvas-app.js').catch(err => {
        console.error('Failed to load canvas app', err);
    });
}