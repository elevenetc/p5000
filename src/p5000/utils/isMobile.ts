// A pragmatic, SSR‑safe mobile detection.
// Combines viewport width with input capabilities and UA as fallback.
// Keeps API unchanged: returns true when likely on a phone-sized, touch-first device.
export const isMobile = (): boolean => {
    // SSR/Node safety
    if (typeof window === 'undefined') return false;

    try {
        // 1) Viewport heuristic: phone-sized screens
        const narrow = Math.min(window.innerWidth || 0, window.innerHeight || 0) < 768;

        // 2) Input capability heuristics
        const mqCoarse = typeof window.matchMedia === 'function'
            ? window.matchMedia('(pointer: coarse)').matches
            : false;
        const mqNoHover = typeof window.matchMedia === 'function'
            ? window.matchMedia('(hover: none)').matches
            : false;

        const nav: any = typeof navigator !== 'undefined' ? navigator : undefined;
        const hasTouch = !!(
            'ontouchstart' in window ||
            (nav && (nav.maxTouchPoints > 0 || nav.msMaxTouchPoints > 0))
        );

        // 3) UA fallback (covers special cases like older devices, WebViews, etc.)
        const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
        const uaMobile = /Mobi|Android|iPhone|iPad|iPod|IEMobile|BlackBerry|Windows Phone|webOS|Opera Mini/i.test(ua);

        // Final decision:
        // - Prefer a narrow viewport AND touch-first/coarse input
        // - OR explicit mobile UA (covers iPadOS with desktop UA quirks)
        return (narrow && (mqCoarse || mqNoHover || hasTouch)) || uaMobile;
    } catch {
        // Conservative fallback
        return Math.min(window.innerWidth || 0, window.innerHeight || 0) < 768;
    }
};