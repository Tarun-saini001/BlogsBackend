require("module-alias/register");
const dotenv = require("dotenv");
const debugLib = require("debug");
const http = require("http");
const app = require("../app/app");

dotenv.config();

const debug = debugLib("client:server");

const startServer = async () => {
    try {
        const port = normalizePort(process.env.PORT || "2001");
        app.set("port", port);

        const server = http.createServer(app);

        server.listen(port, () => {
            console.log(`Client server is listening on port ${port}`);
        });

        server.on("error", (error) => onError(error, port));
        server.on("listening", () => onListening(server));
    } catch (e) {
        console.error("Client Server failed to start", e);
        process.exit(1);
    }
};

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;     // Named pipe
    if (port >= 0) return port;      // Valid port
    return false;
}

function onError(error, port) {
    if (error.syscall !== "listen") throw error;

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
}

function onListening(server) {
    const addr = server.address();
    const bind =
        typeof addr === "string"
            ? `pipe ${addr}`
            : `port ${addr && addr.port}`;
    debug(`Listening on ${bind}`);
}

startServer();
