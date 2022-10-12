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

const getResource = async (url) => {
    let res = await fetch(url);

     if (!res.ok) {
         throw new Error(`Could not fetch ${url}, status: ${res.status}`); // если какая-то ошибка (не ок), кидаем сообщение об ошибке
     }

     return await res.json(); // возвращаем результат в обычном виде
 };

export {postData};
export {getResource};