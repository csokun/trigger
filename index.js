const Chokidar = require('chokidar');
const pino = require('pino')();
const path = require('path');

const CSV_FILENAME_REGEX = new RegExp(/^(.*\.csv)/i);

// start watching
const watcher = Chokidar.watch(path.join(__dirname, 'data'), {
    persistent: true
    , awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});

watcher
    .on('error', pino.error)
    .on('add', (filename) => {
        setImmediate(() => {
            if (CSV_FILENAME_REGEX.test(filename)) {
                pino.info(`Watcher detected new CSV file ${filename}`);
            }
        });
    });

// termination
process.on('SIGINT', function () {
    pino.info('Watcher terminated');
    watcher.close();
    process.exit(1)
});
