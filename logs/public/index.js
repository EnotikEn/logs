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
