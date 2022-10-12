function slider ({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
     //Slider

     const slides = document.querySelectorAll(slide);  
     const currentIndex = document.querySelector(currentCounter),
           slider = document.querySelector(container),
           total = document.querySelector(totalCounter),
           prev = document.querySelector(prevArrow),
           next = document.querySelector(nextArrow),
           slidesWrapper = document.querySelector(wrapper),
           slidesField = document.querySelector(field),
           dots = [],
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
 
}

export default slider;