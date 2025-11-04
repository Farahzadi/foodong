function log(...args) {
    console.log('[foodong] ', ...args);
}

const bottomSheetSelector = '.byn-bottom-sheet__content';


const calcDiscountedPrice = (totalPrice, price, discount) => { return Math.round(Number(price) * Number(discount) / Number(totalPrice)) }

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
                let discount = null;
                if (!rowElement.length) return;
                rowElement.forEach(elem => {
                    if (!elem) return;
                    const desc = elem.querySelector('.byn-row-content__desc')?.textContent;
                    const price = elem.querySelector('.price')?.textContent;
                    const priceNumber = parseInt(price) * 1000;
                    const pElements = Array.from(elem.querySelectorAll('.byn-row__left-element p')).map(elem => elem.textContent);
                    const multiplier = parseInt(pElements.find((elem) => /^\d+×$/.test(elem)));
                    const discountElement = elem.querySelector('.khewPs');
                    if (price && desc && !discountElement) {
                        items.push({ name: desc, value: priceNumber, multiplier: multiplier ? multiplier : 1 });
                    }
                    if (discountElement) {
                        discount = priceNumber;
                    }

                });
                const totalPrice = items.reduce((acc, elem) => elem.value * elem.multiplier + acc, 0);
                const itemsWithDiscount = items.map(elem => {
                    elem.discount = calcDiscountedPrice(totalPrice, elem.value, discount);
                    return elem;
                })
                // log(itemsWithDiscount);
                // log('total price: ', totalPrice);
                const priceRows = Array.from(rowElement).filter(elem => {
                    const price = elem.querySelector('.price')?.textContent;
                    const desc = elem.querySelector('.byn-row-content__desc')?.textContent;
                    const discountElement = elem.querySelector('.khewPs');
                    return price && desc && !discountElement;
                })
                priceRows.forEach((elem, i) => {
                    const resultElement = document.createElement('div');
                    const { value, discount } = itemsWithDiscount[i];
                    const result = Number(value - discount);
                    resultElement.classList.add('__result__')
                    resultElement.innerHTML = result.toLocaleString(('fa-ir')) + ' تومان';
                    elem.querySelector('.price').prepend(resultElement);
                })
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
