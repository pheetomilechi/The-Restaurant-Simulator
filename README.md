# The-Restaurant-Simulator
Visualizing Node.js Event Loop with Async Patterns
Build an interactive server that demonstrates the event loop's behavior through a restaurant ordering analogy. Students will create multiple endpoints showing how different async patterns affect request handling, with visual logging that makes the event loop's behavior observable.

SBTS PROJECT 3 EVENT LOOP VISUALIZER REPORT
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

 

