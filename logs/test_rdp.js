const fs = require('fs');
const path = require('path');
const SMB2 = require('smb2');

// Конфигурация серверов
const servers = [
    {
        host: 'rdp1.com',
        username: 'user',
        password: 'password',
        share: '\\\\rdp1.com\\share',
        logPath: '\\logs',
    },
];

const destinationFolder = path.join(__dirname, 'all_logs');

// Создаем папку для логов, если она не существует
if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
}

function fetchLogsFromServer(server) {
    return new Promise((resolve, reject) => {
        const smb2Client = new SMB2({
            share: server.share,
            domain: '',
            username: server.username,
            password: server.password,
        });

        const remoteLogPath = path.join(server.logPath);

        smb2Client.readdir(remoteLogPath, (err, files) => {
            if (err) return reject(err);

            const promises = files.map((file) => {
                return new Promise((res, rej) => {
                    const remoteFilePath = path.join(remoteLogPath, file);
                    const localFilePath = path.join(
                        destinationFolder,
                        `${server.host}_${file}`
                    );
                    smb2Client.readFile(remoteFilePath, (err, data) => {
                        if (err) return rej(err);
                        fs.writeFile(localFilePath, data, (err) => {
                            if (err) return rej(err);
                            res();
                        });
                    });
                });
            });

            Promise.all(promises)
                .then(() => {
                    smb2Client.close();
                    resolve();
                })
                .catch((err) => {
                    smb2Client.close();
                    reject(err);
                });
        });
    });
}

(async () => {
    try {
        for (const server of servers) {
            await fetchLogsFromServer(server);
            console.log(`Логи с ${server.host} успешно скопированы`);
        }
        console.log('Все логи успешно скопированы');
    } catch (err) {
        console.error('Ошибка при копировании логов:', err);
    }
})();
