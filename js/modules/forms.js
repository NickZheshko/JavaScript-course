import {closeModalWindow, openModalWindow} from './modal';

function forms (modalWindowTimerId) {
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
                     console.log(data);
                 }).finally(() => {
                     form.reset(); // очищаем содержимое формы
                 });
         });
     }
 
     function showThanksModal(message) {
         const prevModalDialog = document.querySelector('.modal__dialog');
 
         prevModalDialog.classList.add('hide');
         openModalWindow('.modal', modalWindowTimerId);
 
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
             closeModalWindow('.modal');
         }, 4000);
 
     }
 
     fetch('http://localhost:3000/menu')
         .then(data => data.json())
 
}

export default forms;