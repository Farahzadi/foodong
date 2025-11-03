function log(...args) {
    console.log('[foodong]: ', ...args);
}

const bottomSheetSelector = '.byn-bottom-sheet__content';

const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            const el = node.matches?.(bottomSheetSelector)
                ? node
                : node.querySelector?.(bottomSheetSelector);

            if (el) {
                el.style.border = "1px solid orange";
                const rowElement = el.querySelectorAll('.byn-row--narrower');
                let items = [];
                if (!rowElement.length) return;
                rowElement.forEach(elem => {
                    if (!elem) return;
                    const desc = elem.querySelector('.byn-row-content__desc')?.textContent;
                    const title = elem.querySelector('.byn-row-content__title')?.textContent;
                    const price = elem.querySelector('.price')?.textContent;
                    const discount = elem.querySelector('.khewPs')?.textContent;
                    if (price && desc && !discount) {
                        items.push({ name: desc, value: price })
                    }
                    if (title)
                        log(title, price);
                });
                log(items);
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
