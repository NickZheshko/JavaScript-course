function cards() {
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
            <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            </div>`;

            this.parent.append(element);
        }
    }
    const getResource = async (url) => {
       let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); // если какая-то ошибка (не ок), кидаем сообщение об ошибке
        }

        return await res.json(); // возвращаем результат в обычном виде
    };

    getResource('http://localhost:3000/menu') // вызываем ф-цию с методом GET
        .then(data => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => { // деструктуризация 
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render(); // создаем карточки с аргументы из файла db.json
            }); // меню и контейнер - родитель

        });
}

export default cards;