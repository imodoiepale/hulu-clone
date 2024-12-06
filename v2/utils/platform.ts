import { Capacitor } from '@capacitor/core';

export const isPlatform = {
    ios: () => Capacitor.getPlatform() === 'ios',
    android: () => Capacitor.getPlatform() === 'android',
    native: () => Capacitor.isNativePlatform(),
    web: () => Capacitor.getPlatform() === 'web'
};

export const getSafeAreaInsets = () => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0 };

    const style = window.getComputedStyle(document.documentElement);
    return {
        top: parseInt(style.getPropertyValue('--safe-area-top') || '0', 10),
        bottom: parseInt(style.getPropertyValue('--safe-area-bottom') || '0', 10)
    };
};

export const handleNativeBackButton = (callback: () => void) => {
    if (!isPlatform.native()) return;

    document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(10, () => {
            callback();
        });
    });
};