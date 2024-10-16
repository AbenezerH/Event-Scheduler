const app = require('./app');

const server = app.listen(5000, () => {
    console.log("the server listening at port 5000");
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing server gracefully.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Closing server gracefully.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

module.exports = server;