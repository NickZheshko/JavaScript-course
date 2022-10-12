
import  tabs   from './modules/tabs';
import  modal  from './modules/modal';
import  timer  from './modules/timer';
import  cards  from './modules/cards';
import  calc   from './modules/calc';
import  forms  from './modules/forms';
import  slider from './modules/slider';
import {openModalWindow} from './modules/modal';


window.addEventListener('DOMContentLoaded', () => {

    let modalWindowTimerId = setTimeout( () => openModalWindow('.modal', modalWindowTimerId), 50000); //запускаем функция openModalWindow через 5 сек после загрузки страницы

      tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
      modal('[data-modal]', '.modal', modalWindowTimerId);
      timer('.timer', '2023-02-17');
      cards();
      calc();
      forms('form', modalWindowTimerId);
      slider({
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        slide: '.offer__slide',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
      });
  
         
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