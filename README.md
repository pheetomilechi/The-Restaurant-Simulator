# Event Loop Visualizer

Visualizing Node.js Event Loop with Async Patterns

## Overview

An interactive educational server that demonstrates the Node.js Event Loop's behavior through multiple endpoints showcasing different async patterns. This project provides real-time visual logging that makes the event loop's complex behavior observable and understandable.

## Features

- **Interactive Dashboard** - Real-time log visualization with WebSocket connections
- **Multiple Test Endpoints** - Showcase blocking operations, microtask vs macrotask execution, and race conditions
- **Color-Coded Logging** - Visual distinction between different operation types
- **Educational Focus** - Learn how async patterns affect request handling and event loop behavior
- **Browser-Based UI** - Access the dashboard via web browser to see logs in action

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Install dependencies:
```bash
npm install
```

## Getting Started

Start the server:
```bash
npm start
```

Or use nodemon for development:
```bash
npm run dev
```

The server will start on **http://localhost:3000**

### Access the Dashboard

Navigate to: `http://localhost:3000/dashboard`

The dashboard displays real-time logs and includes test buttons for triggering different event loop behaviors.

## Project Structure

```
event-loop-visualizer/
├── server.js           # Main Express server with endpoints and WebSocket
├── dashboard.html      # Interactive dashboard UI
├── package.json        # Dependencies
└── README.md          # This file
```

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page with documentation |
| `/dashboard` | GET | Interactive real-time dashboard |
| `/blocking/:time` | GET | Blocks event loop for specified milliseconds |
| `/order-of-execution` | GET | Shows microtask vs macrotask priority |
| `/nonblocking-io` | GET | Non-blocking I/O operations |
| `/complex` | GET | Mixed async operations scenario |
| `/race-demo` | GET | Operation interleaving demo |
| `/detect-blocking` | GET | Event loop blocking detection |

## How It Works

### The Event Loop

The Node.js Event Loop manages operations in these phases:

1. **Timers** - Execute `setTimeout()` and `setInterval()` callbacks
2. **Pending Callbacks** - Execute deferred I/O callbacks
3. **Poll** - Wait for new I/O events
4. **Check** - Execute `setImmediate()` callbacks
5. **Close** - Process close callbacks

### Microtasks vs Macrotasks

**Microtasks** (execute first):
- `Promise.then()` / `.catch()` / `.finally()`
- `process.nextTick()`

**Macrotasks** (execute later):
- `setTimeout()` / `setInterval()`
- `setImmediate()`
- I/O operations

**Key Rule**: After each macrotask, ALL pending microtasks execute before the next macrotask.

## Testing Examples

### Block the Event Loop
```bash
curl http://localhost:3000/blocking/5000
```
Demonstrates how synchronous operations freeze request handling.

### See Microtask vs Macrotask Order
```bash
curl http://localhost:3000/order-of-execution
```
Execution order:
1. Synchronous code
2. process.nextTick (microtask)
3. Promise.then (microtask)
4. setImmediate (macrotask)
5. setTimeout (macrotask)

### Observe Race Conditions
```bash
curl http://localhost:3000/race-demo
```
Shows how multiple async operations interleave.

## Key Learning Concepts

### Why Are Microtasks Prioritized?

After completing a macrotask, the event loop checks the microtask queue and executes **all** microtasks before moving to the next macrotask. This ensures async/await works predictably.

### Consequences of Event Loop Blocking

When the event loop is blocked, the server cannot:
- Accept new connections
- Process pending I/O
- Execute timers
- Handle other requests

**Best Practice**: Use async operations, not synchronous code.

## Console Output Colors

- **Blue** - Event Loop activity
- **Yellow** - Macrotasks
- **Magenta** - Microtasks
- **Green** - Async completions
- **Red** - Blocking operations
- **Cyan** - I/O operations

## Learning Outcomes

✓ Understand Node.js Event Loop operation  
✓ Distinguish between microtasks and macrotasks  
✓ Know why Promises execute before setTimeout  
✓ Recognize event loop blocking impact  
✓ Write non-blocking async code  
✓ Use WebSocket for real-time updates  

## Dependencies

- **express** - Web server framework
- **chalk** - Terminal color output
- **ws** - WebSocket protocol
- **ora** - Loading indicators

## License

ISC
# Terminal 1: Start server; Ran the code with ‘npm start’, which gave this; 
> event-loop-visualizer@1.0.0 start
> node server.js
On localhost 3000 and it displayed this on the browser - Welcome to the Event Loop Visualizer! Check the console for details.
#Terminal 2: ‘Test blocking’
Ran this - “curl http://localhost:3000/blocking/5000”, which gave this;
In terminal 2 - Blocked the event loop for 5000ms
In terminal 1 - “[03:42:53.775Z] [BLOCKING] [1] Starting BLOCKING operation for 5000ms
[03:42:58.775Z] [BLOCKING] [1] Blocking operation COMPLETED
[03:58:19.720Z] [EVENT-LOOP] [3] Request GET /fast received”, which blacked the operation for 5 seconds.
After running this “ curl http://localhost:3000/order-of-execution “, i got the following execution order;
“ === STARTING EXECUTION ORDER TEST ===
=== END OF SYNC CODE - Results will show in specific order ===
process.nextTick (microtask) - This run FIRST
Promise.then (microtask) - This runs BEFORE setTimeout
setImmediate (macrotask) - Runs in next event-loop phase
setTimeout (macroTask) - This runs LAST “
“After running, explain why microtasks (Promise, process.nextTick) execute before macrotasks (setTimeout, setImmediate).”
The reason your output follows that specific sequence is due to how the Node.js Event Loop manages its internal queues. Even though we call them all "asynchronous," Node.js treats them with different levels of urgency.

 

