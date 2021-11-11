import "./elements.css";

function hideElement(element: HTMLElement) {
    element.classList.add('hidden');
}

function showElement(element: HTMLElement) {
    element.classList.remove('hidden');
}

function slideInTop(element: HTMLElement) {
    element.classList.remove('slide-in-top');
    element.classList.remove('slide-out-top');
    element.classList.remove('slid-out-top');
    element.classList.add('slide-in-top');
    setTimeout(() => {
        element.classList.add('slid-in-top');
        element.classList.remove('slide-in-top');
    }, 800);
}

function slideOutTop(element: HTMLElement) {
    element.classList.remove('slide-out-top');
    element.classList.remove('slide-in-top');
    element.classList.remove('slid-in-top');
    element.classList.add('slide-out-top');
    setTimeout(() => {
        element.classList.add('slid-out-top');
        element.classList.remove('slide-out-top');
    }, 800);
}

function applySlidInTop(element: HTMLElement) {
    element.classList.remove('slid-out-top');
    element.classList.add('slid-in-top');
}

function applySlidOutTop(element: HTMLElement) {
    element.classList.remove('slid-in-top');
    element.classList.add('slid-out-top');
}

function fadeOut(element: HTMLElement) {
    element.classList.add('fade-out');
}

function shake(element: HTMLElement, inifinite: boolean = false) {
    element.classList.add('shake-infinite');
    if (!inifinite) {
        setTimeout(removeShake, 400, element);
    }
}

function removeShake(element: HTMLElement) {
    element.classList.remove('shake-infinite');
}

export {
    hideElement,
    showElement,
    slideInTop,
    slideOutTop,
    applySlidInTop,
    applySlidOutTop,
    fadeOut,
    shake, 
    removeShake
}
