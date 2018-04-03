export default class Utils {
    static emitEvent(event) {
        event.initCustomEvent('animationEnd', false, true, {});
        document.dispatchEvent(event);
    }
    static fadeInOut(view) {
        view.classList.add('fade-in-out');
    }
    static fadeIn(view) {
        view.classList.add('fade-in');
    }
    static shrink(view) {
        view.classList.add('shrink-anim');
        setTimeout((e) => {
            // view.classList.remove('shrink-anim');
            view.classList.add('shrunk');
        }, 1000);
    }
    static bounceInfinite(view, offset = 1) {
        setTimeout((e) => {
            view.classList.add('bounce-infinite');
        }, (350 * offset));
    }
    static slideFromBottom(view) {
        view.classList.add('slide-from-bottom');
    }
    static slideOutTop(view) {
        view.classList.add('slide-out-top');
    }
    static vibrateDevice(duration) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
    static addCssClass(view, cssClasses) {
        for (let cssClass of cssClasses) {
            view.classList.add(cssClass);
        }
    }
}
Utils.animationEnd = new CustomEvent('animationEnd');
