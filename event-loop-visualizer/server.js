const express = require('express');
const chal = require('chalk');
const { default: chalk } = require('chalk');
const app = express();
const PORT = 3000;

//Helper for visual logging
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
}