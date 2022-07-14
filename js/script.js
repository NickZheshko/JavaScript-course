
const inputRub = document.querySelector('#rub');

const inputUsd = document.querySelector('#usd');

inputRub.addEventListener('input', (e) => {

    const request = new XMLHttpRequest();

    request.open('GET', 'js/current.json'); // путь указываем согласно расположению относительно файла HTML
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send();

    request.addEventListener('load', (e) => {
        if (request.status === 200) { // load срабатывает 1 раз (в отличие от readystatechange) только когда запрос готов (readyState = 4)
            console.log(request.response);
            const data = JSON.parse(request.response);
            console.log(data);
            inputUsd.value = (+inputRub.value / data.current.usd).toFixed(2);
        } else {
            inputUsd.value = 'Как это так случилось...'
        }
    });
});