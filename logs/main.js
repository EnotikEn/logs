const { request } = require('http');
const ADDRESS = require('./info');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// // const username = 'admin'
// // const password = 'fxw7ZvwWx@35112!'

// // const urlSrv = 'https://10.100.104.144:8088/deviceManager/ibase/i18n/i18n_resource.js?t=1544105949486'

// // const xhr = new XMLHttpRequest()

// // xhr.open('GET', 'https://10.100.104.144:8088/deviceManager/ibase/i18n/i18n_resource.js?t=1544105949486', true)
// // xhr.onload = () => {
// //     if (xhr.status >= 200 && xhr.status < 300){
// //         console.log('Good!', xhr.responseText)
// //     } else {
// //         console.error('Error', xhr.statusText)
// //     }
// // }
// // xhr.onerror = () => {
// //     console.error('Network Error')
// // }

// // xhr.send()

// // // const auth = {
// // //         usernamename: username,
// // //         password: password
// // // }

// // // axios.get(urlSrv, auth)
// // //     .then(response => {
// // //         console.log('responce.data')
// // //     })
// // //         .catch(error => {
// // //             console.error('Error fetching logs', error)
// // //         })

const fetch_ased_data = async (url) => {
    const res = await fetch(url);
    // const data = await res.json();
    return res;
};

fetch_ased_data('https://10.100.104.144:8088')
    .then((data) => console.log(data))
    .catch((error) => console.log(error));

// request(
//     {
//         rejectUnauthorized: false,
//         url: 'https://10.100.104.144:8088/deviceManager/ibase/i18n/i18n_resource.js',
//         method: 'GET',
//     },
//     function (err, response, body) {
//         console.log(err);
//         console.log(response);
//         console.log(body);
//     }
// );
