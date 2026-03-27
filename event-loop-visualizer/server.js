const express = require('express');
const chalk = require('chalk');
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
        res.send(`Blocked the event loop for ${time}ms`);
    });

    // Endpoint 2: Async with setTimeout
    app.get('/settimeout/:delay', (req, res) => {
        const delay = parseInt(req.params.delay) || 1000;

        logWithColor(`Setting timeout for ${delay}ms`,'macrotask', req.id);

        setTimeout(() => {
            logWithColor(`Timeout EXECUTED after ${delay}ms`, 'macrotask',
    req.id);
                res.send(`Timeout of ${delay}ms completed`);
            }, delay);
        logWithColor(`Timeout scheduled, continuing execution`, 'event-loop', req.id);
        )};

        // Endpoint 3: Promise Microtasks vs setTimout Macrotasks
        app.get('/order-of-execution', (req, res) => {
            logWithColor('=== STARTING EXECUTION ORDER TEST ===', 'event-loop',
            req.id);
       // This demonstrates microtask vs macrotask  priority
       setTimeout(() => {
        logWithColor('setTimeout (macroTask) - This runs LAST',
        'macrotask', req.id);
        }, 0);

        setImmediate(() => {
            logWithColor('setImmediate (macrotask) - Runs in next event-loop phase',
                'macrotask', req.id);
         });
         Promise.resolve().then(() => {
            logWithColor('Promise.then (microtask) - This runs BEFORE setTimeout',
            'microtask', req.id);
         });
         process.nextTick(() => {
            logWithColor('process.nextTick (microtask) - This run FIRST',
                'microtask', req.id);
         });
         logWithColor('=== END OF SYNC CODE - Results will show in specific order ===',
            'event-loop', req.id);
        // Send response after all async operations
        setTimeout(() => {
            res.json({
                message: 'Check console to see execution order',
                expectedOrder: [
                    '1. Synchronous code (this message)',
                    '2. process.nextTick',
                    '3. Promise.then',
                    '4. setImmediate',
                    '5. setTimeout (even with 0 delay'
                ]
            });
        }, 100);
       });

       // Endpoint 4: Non-blocking I/O Simulation