function closeModalWindow(modalSelector) {
    let modalWindow = document.querySelector(modalSelector);
    modalWindow.classList.add('hide');
    modalWindow.classList.remove('show');
    document.body.style.overflow = ''; // "размораживает" страницу
}

function openModalWindow(modalSelector, modalWindowTimerId) {
    let modalWindow = document.querySelector(modalSelector);
    modalWindow.classList.add('show');
    modalWindow.classList.remove('hide');
    document.body.style.overflow = 'hidden'; //"замораживает" страницу без возможности прокрутки

    console.log(modalWindowTimerId);
    if (modalWindowTimerId) {
        clearInterval(modalWindowTimerId);
    }
}

function modal(triggerSelector, modalSelector, modalWindowTimerId) {
    // Модальное окно

    let modalBtns = document.querySelectorAll(triggerSelector),
        modalWindow = document.querySelector(modalSelector);


    modalBtns.forEach(btn => {
        btn.addEventListener('click', () => openModalWindow(modalSelector, modalWindowTimerId));
    });


    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModalWindow(modalSelector);
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModalWindow(modalSelector);
        }
    });


    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) { // когда заскроллим в самый низ, вызовем функцию
            openModalWindow(modalSelector, modalWindowTimerId);
            window.removeEventListener('scroll', showModalByScroll); // удаляем обработчик события
        }
    }

    window.addEventListener('scroll', showModalByScroll); //вешаем обратчик событий на window, scroll - при прокрутке начнет действовать

}

export default modal;
export {closeModalWindow};
export {openModalWindow};