const express = require('express');
const fetchAllLogs = require('./main');

const app = express();
const port = 7777;

app.use(express.static('public'));

app.get('/logs-servers', async (req, res) => {
    try {
        const allFiles = await fetchAllLogs();
        res.json({ files: allFiles });
    } catch (err) {
        console.error('Ошибка при копировании логов', err);
        res.status(500).send('Ошибка при копировании логов');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
