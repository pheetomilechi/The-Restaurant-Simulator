const express = require('express');
const chal = require('chalk');
const { default: chalk } = require('chalk');
const app = express();
const PORT = 3000;

// Helper for visual logging
function logWithColor(message, type, requireId) {
    const timestamp = new Date().toISOString().split('T') [1];
    const colors = {
        'event-loop': chalk.blue,
        'microtask': chalk.magenta,
        'macrotask': chalk.yellow,
        'blocking': chalk.red,
        'async': chalk.green,
        'io': chalk.cyan
    };
    const colorFn = colors[type] || chalk.white;
    console.log(colorFn(`[${timestamp}] [${type.toUpperCase()}]
    [${requestId}] $(message)`));

    // Middleware to track request IDs
    let requestCounter = 0;
    app.use((req, res, next) => {
        req.id = ++requestCounter;
        logWithColor(`Request ${req.method} ${req.url} received`,
        'event-loop', req.id);
        next();
    });

    // Endpoint 1: Synchronous - Event Loop Blocking
    app.get('/blocking/time', (req, res) => {
        const time = parsInt(req.params.time) || 3000;
        const end = Date.now() + time;

        logWithColor(`Starting BLOCKING operation
        for ${time}ms`, 'blocking', req.id);

        // Block the event loop
        while (Date.now() < end) {
            // CPU-intensive loop
        }
        logWithColor(`Blocking operation COMPLETED`, 'blocking', req.id);
        res.send(`Blocked the event loop for ${times}ms`);
    })
}