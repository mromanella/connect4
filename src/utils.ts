export default class Utils {

    static animationEnd = new CustomEvent('animationEnd');

    private static emitEvent(event: CustomEvent) {
        event.initCustomEvent('animationEnd', false, true, {});
        document.dispatchEvent(event);
    }

    static fadeInOut(view: Element) {
        view.classList.add('fade-in-out');
    }

    static fadeIn(view: Element) {
        view.classList.add('fade-in');
    }

    static shrink(view: Element) {
        view.classList.add('shrink-anim');
            setTimeout((e) => {
                // view.classList.remove('shrink-anim');
                view.classList.add('shrunk');
            }, 1000);
    }

    static bounceInfinite(view: Element, offset: number = 1) {
        setTimeout((e) => {
            view.classList.add('bounce-infinite');
        }, (350 * offset));
    }

    static slideFromBottom(view: Element) {
        view.classList.add('slide-from-bottom');
    }

    static slideOutTop(view: Element) {
        view.classList.add('slide-out-top');
    }

    static vibrateDevice(duration: number[]) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    static addCssClass(view: HTMLElement, cssClasses: string[]) {
        for (let cssClass of cssClasses) {
            view.classList.add(cssClass);
        }
    }
}