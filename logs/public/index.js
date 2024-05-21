document.getElementById('fetchLogs').addEventListener('click', async () => {
    try {
        const response = await fetch('/logs-servers');
        if (!response.ok) {
            throw new Error('Сеть не в порядке');
        }
        const data = await response.json();
        const logsList = document.getElementById('logsList');
        logsList.innerHTML = '';
        data.files.forEach((file) => {
            const listItem = document.createElement('li');
            listItem.textContent = file;
            listItem.style.cursor = 'pointer';
            listItem.addEventListener('click', async () => {
                const fileResponse = await fetch(
                    `/log-content?filename=${encodeURIComponent(file)}`
                );
                if (!fileResponse.ok) {
                    throw new Error('Ошибка загрузки log контента');
                }
                const fileContent = await fileResponse.text();
                document.getElementById('logContent').textContent = fileContent;
            });
            logsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Проблема с запросом:', error);
    }
});

document.getElementById('toggleButton2').addEventListener('click', function () {
    var logsList = document.getElementById('logsList');
    if (logsList.style.display === 'none') {
        logsList.style.display = 'block';
    } else {
        logsList.style.display = 'none';
    }
});

document.getElementById('toggleButton1').addEventListener('click', function () {
    var logContent = document.getElementById('logContent');
    if (logContent.style.display === 'none') {
        logContent.style.display = 'block';
    } else {
        logContent.style.display = 'none';
    }
});

// document.getElementById('toggleButton3').addEventListener('click', function () {
//     console.log('Click event fired!'); // Проверка срабатывания обработчика события
//     var menu = this.querySelector('.menu');
//     console.log(menu); // Проверка, выбирается ли меню правильно
//     menu.classList.toggle('active'); // Добавляем или удаляем класс "active" для меню
// });

// document.addEventListener('DOMContentLoaded', function () {
//     document.body.addEventListener('click', function (event) {
//         var toggleButton = event.target.closest('#toggleButton');
//         if (toggleButton) {
//             var menu = toggleButton.querySelector('.menu');
//             if (menu) {
//                 menu.classList.toggle('active');
//             }
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    var toggleButton = document.getElementById('toggleButton3');
    toggleButton.addEventListener('click', function () {
        var menu = document.getElementById('menu');
        if (menu) {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            } else {
                menu.classList.add('active');
            }
        }
    });
});

// document.addEventListener('DOMContentLoaded', function () {
//     var toggleButton = document.getElementById('toggleButton3');
//     var menu = document.getElementById('menu');
//     var fetchLogs = document.getElementById('fetchLogs');

//     toggleButton.addEventListener('click', function (event) {
//         event.stopPropagation();
//         menu.classList.toggle('active');
//         fetchLogs.classList.toggle('hidden');
//     });

//     // Добавим обработчик для клика по документу
//     document.addEventListener('click', function (event) {
//         if (
//             menu.classList.contains('active') &&
//             !menu.contains(event.target) &&
//             !toggleButton.contains(event.target)
//         ) {
//             menu.classList.remove('active');
//             fetchLogs.classList.remove('hidden');
//         }
//     });
// });
