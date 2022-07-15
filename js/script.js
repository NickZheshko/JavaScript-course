window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');


    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        let target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }

            });
        }
    });


    // Timer

    let deadline = '2022-09-01';

    function getTimeRemaning(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        let timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timerId = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            let t = getTimeRemaning(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timerId);
            }


        }
    }

    setClock('.timer', deadline);


    // Timer


    // Модальное окно

    let modalBtns = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal');


    function closeModalWindow() {
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = ''; // "размораживает" страницу
    }

    function openModalWindow() {
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden'; //"замораживает" страницу без возможности прокрутки
    }


    modalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openModalWindow();
        });
    });


    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModalWindow();
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModalWindow();
        }
    });


    // let modalWindowTimmerId = setTimeout(openModalWindow, 50000); //запускаем функция openModalWindow через 5 сек после загрузки страницы

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) { // когда заскроллим в самый низ, вызовем функцию
            openModalWindow();
            window.removeEventListener('scroll', showModalByScroll); // удаляем обработчик события
        }
    }


    window.addEventListener('scroll', showModalByScroll); //вешаем обратчик событий на window, scroll - при прокрутке начнет действовать


    // Используем классы для карточек

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
        res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); // если какая-то ошибка (не ок), кидаем сообщение об ошибке
        }

        return await res.json(); // возвращаем результат в обычном виде
    };

    getResource('http://localhost:3000/menu') // вызываем ф-цию с методом GET
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => { // деструктуризация 
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render(); // создаем карточки с аргументы из файла db.json
        });                                                                                  // меню и контейнер - родитель

    });

    //Forms
    const forms = document.querySelectorAll('form'); // собираем все формы в Node list

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }; // объект, хранящий в себе типы сообщений-статусов о загрузке данных на сервер

    forms.forEach(item => {
        bindPostData(item);
    }); // вешаем ф-цию postData на все forms

    const postData = async (url, data) => {
        res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => { // отправка данных с формы
            e.preventDefault(); // отключаем стандартное поведение браузера (станица не перезагружается)
            const statusMessage = document.createElement('img'); // создание нового блока, в котором будет выводиться сообщение-статус
            statusMessage.src = message.loading; //пути к картинке сообщения о статусе присваиваем адрес спинера
            statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage); //постим его в верстку

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove(); // удалить блок с сообщением
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset(); // очищаем содержимое формы
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModalWindow();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
                <div class = "modal__content"> 
                    <div class = "modal__close" data-close>×</div>
                    <div class = "modal__title">${message}</div>
                </div>
            `; //  modal__content - обертка, modal__close - крестик

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModalWindow();
        }, 4000);

    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())

});