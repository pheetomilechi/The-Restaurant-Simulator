const express = require('express');
const chalk = require('chalk');
const app = express();
const PORT = 3000;

// Helper for visual logging
function logWithColor(message, type, requestId) {
    const timestamp = new Date().toISOString().split('T')[1];
    const colors = {
        'event-loop': chalk.blue,
        'microtask': chalk.magenta,
        'macrotask': chalk.yellow,
        'blocking': chalk.red,
        'async': chalk.green,
        'io': chalk.cyan
    };

    const colorFn = colors[type] || chalk.white;
    console.log(colorFn(`[${timestamp}] [${type.toUpperCase()}] [${requestId}] ${message}`));
}

// Middleware to track request IDs
let requestCounter = 0;
app.use((req, res, next) => {
    req.id = ++requestCounter;
    logWithColor(`Request ${req.method} ${req.url} received`, 'event-loop', req.id);
    next();
});


// // Endpoint 1: Synchronous - Event Loop Blocking
    app.get('/blocking/:time', (req, res) => {
        const time = parseInt(req.params.time) || 3000;
        const end = Date.now() + time;

        logWithColor(`Starting BLOCKING operation for ${time}ms`, 'blocking', req.id);

        // Block the event loop
        while (Date.now() < end) {
            // CPU-intensive loop
        }
        
        logWithColor(`Blocking operation COMPLETED`, 'blocking', req.id);
        res.send(`Blocked the event loop for ${time}ms`);
    });

//     // Endpoint 2: Async with setTimeout
    app.get('/settimeout/:delay', (req, res) => {
        const delay = parseInt(req.params.delay) || 1000;

        logWithColor(`Setting timeout for ${delay}ms`, 'macrotask', req.id);

        setTimeout(() => {
            logWithColor(`Timeout EXECUTED after ${delay}ms`, 'macrotask', req.id);
            res.send(`Timeout of ${delay}ms completed`);
        }, delay);
        logWithColor(`Timeout scheduled, continuing execution`, 'event-loop', req.id);
    });

// // Endpoint 3: Promise Microtasks vs setTimeout Macrotasks
    app.get('/order-of-execution', (req, res) => {
        logWithColor('=== STARTING EXECUTION ORDER TEST ===', 'event-loop', req.id);
        // This demonstrates microtask vs macrotask priority
        setTimeout(() => {
            logWithColor('setTimeout (macroTask) - This runs LAST', 'macrotask', req.id);
        }, 0);

        setImmediate(() => {
            logWithColor('setImmediate (macrotask) - Runs in next event-loop phase', 'macrotask', req.id);
        });
        Promise.resolve().then(() => {
            logWithColor('Promise.then (microtask) - This runs BEFORE setTimeout', 'microtask', req.id);
        });
        process.nextTick(() => {
            logWithColor('process.nextTick (microtask) - This run FIRST', 'microtask', req.id);
        });
        logWithColor('=== END OF SYNC CODE - Results will show in specific order ===', 'event-loop', req.id);
        // Send response after all async operations
        setTimeout(() => {
            res.json({
                message: 'Check console to see execution order',
                expectedOrder: [
                    '1. Synchronous code (this message)',
                    '2. process.nextTick',
                    '3. Promise.then',
                    '4. setImmediate',
                    '5. setTimeout (even with 0 delay)'
                ]
            });
        }, 100);
    });


// // Endpoint 4: Non-blocking I/O Simulation
    app.get('/nonblocking-io', async (req, res) => {
        logWithColor('Starting non-blocking operation', 'io', req.id);

        // Simulate async I/O that doesn't block
        await new Promise(resolve => {
            setTimeout(() => {
                logWithColor('Async I/O operation completed', 'io', req.id);
                resolve();
            }, 2000);
        });
        logWithColor('Response ready to send', 'async', req.id);
        res.send('Non-blocking operation completed');
    });


// Endpoint 5: Mixed Operations - Real-world scenario
    app.get('/complex', (req, res) => {
        let completed = 0;
        const checkComplete = () => {
            completed++;
            if (completed === 3) {
                logWithColor('ALL OPERATIONS COMPLETE - Sending response', 'async', req.id);
                res.send('Complex operation completed');
            }
        };
                logWithColor('Starting complex operation with multiple async tasks', 'event-loop', req.id);

    // //             // Operation 1: CPU-intensive but non-blocking via setImmediate
                setImmediate(() => {
                    logWithColor('Starting CPU task in setImmediate', 'macrotask', req.id);
                    let sum = 0;
                    for (let i = 0; i < 10000000; i++) {
                        sum += i;
                    }
                    logWithColor(`CPU task completed: sum = ${sum}`, 'macrotask', req.id);
                    checkComplete();
                });
            
    //             // Operation 2: Async database query simulation
                setTimeout(() => {
                    logWithColor('Database query completed', 'io', req.id);
                    checkComplete();
                }, 1000);

    //             // Operation 3: File operating Simulation
                Promise.resolve().then(() => {
                    logWithColor('File read operation completed (microtask', 'microtask', req.id);
                    checkComplete();
                });

                logWithColor('All operations initiated', 'event-loop', req.id);
            });

// Endpoint 6: Visual Demo - Race Conditions
    app.get('/race-demo', (req,res) => {
        let counter = 0;

        logWithColor('=== RACE CONDITION DEMO ===', 'event-loop', req.id);

        // This demonstrates how operations interleave
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                counter++;
                logWithColor(`Timeout ${i + 1} incremented counter to ${counter}`, 'macrotask', req.id);
            }, Math.random() * 100);
        }

        for (let i = 0; i < 5; i++) {
            Promise.resolve().then(() => {
                counter++;
                logWithColor(`Promise ${i + 1} incremented counter to ${counter}`, 'microtask', req.id);
            });
        }
        setTimeout(() => {
            res.json({
                message: 'Race condition demo completed',
                finalCounter: counter,
                note: 'Notice how microtasks execute before macrotasks, even if macrotasks were scheduled first'
            });
        }, 200);
    });

    // Endpoint 7: Event Loop Blocking Detection
    app.get('/detect-blocking', (req, res) =>{
        let lastLoop = Date.now();

        // Monitor event loop health
        const monitorInterval = setInterval(() => {
            const now = Date.now();
            const delay = now - lastLoop;
            if (delay > 100) {
                logWithColor(`EVENT LOOP BLOCKED for ${delay}ms!`, 'blocking', 'MONITOR');
            }
            lastLoop = now;
        }, 100);

    // Simulate a long-running operation
    setTimeout(() => {
        logWithColor('Starting potentially blocking operation', 'blocking', req.id);

        // This blocks the event loop
        const start = Date.now();
        while (Date.now() - start < 3000) {
            // CPU intensive
        }

        clearInterval(monitorInterval);
        logWithColor('Blocking operation completed', 'blocking', req.id);
        res.send('Check console for event loop blocking detection');
    }, 100);
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(chalk.green(`\nServer running at http://localhost:${PORT}`));
        console.log(chalk.yellow('Open the console to watch the event loop in action!\n'));
    });

    // Add to server.js
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: 3001});

    wss.on('connection', (ws) => {
        console.log('Dashboard connected');
    });

    // Modify logWithColor to broadcast to WebSocket clients
    function logWithColor(message, type, requestId) {
        const timestamp = new Date().toISOString().split('T') [1];
        const logData = { timestamp, type, message, requestId };

        // Broadcast to all connected dashboards
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(logData));
            }
        });

    // Console logging with colors (keep existing code)
    const colors = {
        'event-loop': chalk.blue,
        'microtask': chalk.magenta,
        'macrotask': chalk.yellow,
        'blocking': chalk.red,
        'async': chalk.green,
        'io': chalk.cyan
    };

    const colorFn = colors[type]  || chalk.white;
    console.log(colorFn(`[${timestamp}] [${type.toUpperCase()}] 
    [${requestId}] ${message}`));
}
