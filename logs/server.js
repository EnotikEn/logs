const express = require('express');
const fs = require('fs');
const path = require('path');
const fetchAllLogs = require('./main');

const app = express();
const port = 7777;
const destinationFolder = path.join(__dirname, 'all_logs_servers');

app.use(express.static('public'));

app.get('/logs-servers', async (req, res) => {
    try {
        await fetchAllLogs();
        const files = fs.readdirSync(destinationFolder);
        res.json({ files });
    } catch (err) {
        console.error('Ошибка при копировании логов:', err);
        res.status(500).send('Ошибка при копировании логов');
    }
});

app.get('/log-content', (req, res) => {
    const filename = req.query.filename;
    const filePath = path.join(destinationFolder, filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(
                `Файл ${filePath} не существует или к нему нет доступа: ${err.message}`
            );
            return res
                .status(404)
                .send(`Файл ${filename} не существует или к нему нет доступа`);
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(
                    `Ошибка при чтении файла ${filePath}: ${err.message}`
                );
                return res
                    .status(500)
                    .send(`Ошибка при чтении файла ${filename}`);
            }

            res.send(data);
        });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
