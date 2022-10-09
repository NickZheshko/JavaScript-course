function timer () {
     // Timer

     let deadline = '2022-10-28';

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
 
}

export default timer;