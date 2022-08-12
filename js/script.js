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


    //Slider

    const slides = document.querySelectorAll('.offer__slide');  
    const currentIndex = document.querySelector('#current'),
          slider = document.querySelector('.offer__slider'),
          total = document.querySelector('#total'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          dots = [];
          width = window.getComputedStyle(slidesWrapper).width;  // берет св-во width (тип - строка) у возвращенного объекта с примененными стилями (с пикселями)

    let slideIndex = 1,
        offset = 0;

    function convert(w) {
        return  +w.replace(/\D/ig, "");         // удаляем все, что не цифры
    }

    function changeDotsOpacity() {
            dots.forEach(dot => dot.style.opacity ='.5');        // 50 %   
            dots[slideIndex - 1].style.opacity = 1; 
    }

    function changeSliderCounter() {
        if (slides.length < 10) {
            total.textContent = `0${slides.length}`;
            currentIndex.textContent = `0${slideIndex}`;
        } else {
            total.textContent = slides.length;
            currentIndex.textContent = slideIndex;
        }
    }

        changeSliderCounter();

        slidesField.style.width = 100 * slides.length + '%';
        slidesField.style.display = 'flex';
        slidesField.style.transition = '0.5s all';
        slidesWrapper.style.overflow = 'hidden';

        console.log(slidesField);

        slides.forEach(slide => {
            slide.style.width = width;
        });

        slider.style.position = 'relative';

        const indicators = document.createElement('ol');      // для точек
        indicators.classList.add('carousel-indicators');     // класс, скопированный из доп.файла styles.css   
        slider.append(indicators);  

        for (let i = 0; i < slides.length; i++) {            // в цикле создаются точки для слайда
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i + 1);       // два параметра - название и значение (name, value)
            dot.classList.add('dot');
            if (i == 0) {
                dot.style.opacity = 1;
            }
            indicators.append(dot);  
            dots.push(dot);   
        }

        next.addEventListener('click', () => {
            if (offset == convert(width) * (slides.length - 1)) { // преобразуем строку в число (если долистали до конца)
                offset = 0;
            } else {
                offset += convert(width);             // регулярка, чтобы обрезать px в конце строки
            }

            slidesField.style.transform = `translateX(-${offset}px)`;       // производим смещение

            if (slideIndex == slides.length) {
                slideIndex = 1;
            } else {
                slideIndex++;
            }

            changeSliderCounter();

            changeDotsOpacity();
        });
        
        prev.addEventListener('click', () => {
            if (offset == 0) { 
                offset = convert(width) * (slides.length - 1); // регулярка, чтобы обрезать px в конце строки
            } else {
                offset -= convert(width);
            }
            
            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slideIndex == 1) {
                slideIndex = slides.length;
            } else {
                slideIndex--;
            }

            changeSliderCounter();

            changeDotsOpacity();
    });
      
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const slideTo = e.target.getAttribute('data-slide-to');     // получаем значение атрибутов (они соответствуют номерам точек в массиве: 1, 2, 3, 4)

                    slideIndex = slideTo;
                    offset = convert(width) * (slideTo - 1);

                    slidesField.style.transform = `translateX(-${offset}px)`;

                    changeSliderCounter();

                    changeDotsOpacity();
                });
            });

    // Calc
    
    const result = document.querySelector('.calculating__result span'); // результат по калориям
    let sex, height, weight, age, ratio;                                    // ratio - коэффициент

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '=(';
            return;
        }

        if (sex === 'female') {
            result.textContent = (447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio;
        } else {
            result.textContent = (88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio;
        }
    }

        calcTotal();

        function getStaticInformation(parentSelector, activeClass) {
            const elements = document.querySelectorAll(`${parentSelector} div`);
        }








         
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides(n) {

    //     if (n < 1) {
    //         slideIndex = slides.length;      // если с 1 картинки клик назад
    //     } 

    //     if (n > slides.length) {
    //         slideIndex = 1;                 // если с последней картинки клик вперед
    //     } 

    //     slides.forEach((item) => {
    //         item.classList.add('hide');
    //     });

    //    slides[slideIndex - 1].classList.remove('hide');
    //    currentIndex.textContent = `0${slideIndex}`;

    //    if (slides.length < 10) {
    //         currentIndex.textContent = `0${slideIndex}`;
    //    } else {
    //         currentIndex.textContent = slideIndex;
    //    }
    // }

    // showSlides(slideIndex);

    // function changeIndex (n) {
    //     showSlides(slideIndex += n);        // изменяем индекс перед тем как передать в ф-цию (сразу при нажатии на кнопку)
    // }

    // prev.addEventListener('click', () => {
    //     changeIndex(-1);
    // })

    // next.addEventListener('click', () => {
    //     changeIndex(1);
    // })
        
});