const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');
const servers = require('./info_servers');

const destinationFolder = path.join(__dirname, 'all_logs_servers');

// Создаем папку для логов, если она не существует
try {
    fs.mkdirSync(destinationFolder, { recursive: true });
} catch (err) {
    if (err.code !== 'EEXIST') {
        console.error('Ошибка при создании папки для логов:', err);
        process.exit(1);
    }
}

async function fetchLogsFromServer(serverConfig) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            console.log(`Соединение с ${serverConfig.host} установлено`);
            conn.sftp((err, sftp) => {
                if (err) {
                    console.error(`Ошибка SFTP: ${err.message}`);
                    conn.end();
                    return reject(err);
                }

                sftp.readdir(serverConfig.logPath, (err, list) => {
                    if (err) {
                        console.error(
                            `Ошибка при чтении директории ${serverConfig.logPath}: ${err.message}`
                        );
                        conn.end();
                        return reject(err);
                    }

                    if (list.length === 0) {
                        conn.end();
                        return reject(
                            new Error(
                                `Директория ${serverConfig.logPath} пуста`
                            )
                        );
                    }

                    console.log(
                        `Содержимое директории ${serverConfig.logPath}:`,
                        list
                    );

                    const downloadPromises = list.map((file) => {
                        const remoteFilePath = path.posix.join(
                            serverConfig.logPath,
                            file.filename
                        );
                        const localFilePath = path.join(
                            destinationFolder,
                            `${serverConfig.host}_${file.filename}`
                        );

                        console.log(
                            `Копирование файла с ${remoteFilePath} на ${localFilePath}`
                        );

                        return new Promise((res, rej) => {
                            const readStream =
                                sftp.createReadStream(remoteFilePath);
                            const writeStream =
                                fs.createWriteStream(localFilePath);

                            readStream
                                .on('error', (err) => {
                                    console.error(
                                        `Ошибка при чтении файла ${remoteFilePath}: ${err.message}`
                                    );
                                    rej(err);
                                })
                                .pipe(writeStream)
                                .on('finish', () => {
                                    console.log(
                                        `Файл ${remoteFilePath} успешно скопирован`
                                    );
                                    res();
                                })
                                .on('error', (err) => {
                                    console.error(
                                        `Ошибка при записи файла ${localFilePath}: ${err.message}`
                                    );
                                    rej(err);
                                });
                        });
                    });

                    Promise.all(downloadPromises)
                        .then(() => {
                            conn.end();
                            resolve();
                        })
                        .catch((err) => {
                            conn.end();
                            reject(err);
                        });
                });
            });
        })
            .on('error', (err) => {
                console.error(
                    `Ошибка при подключении к ${serverConfig.host}: ${err.message}`
                );
                reject(err);
            })
            .connect({
                host: serverConfig.host,
                port: 22,
                username: serverConfig.username,
                password: serverConfig.password,
            });
    });
}

(async () => {
    try {
        for (const serverKey in servers) {
            const serverConfig = servers[serverKey];
            await fetchLogsFromServer(serverConfig);
            console.log(`Логи с ${serverConfig.host} успешно скопированы`);
        }
        console.log('Все логи успешно скопированы');
    } catch (err) {
        console.error('Ошибка при копировании логов:', err);
        process.exit(1);
    }
})();
