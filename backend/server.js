import { createServer } from "node:http"

// DB in-memory

let taskId = 3;

const db = {
    tasks: [
        {
            id: 1,
            title: "Nau com"
        },
        {
            id: 2,
            title: "Rua bat"
        }
    ]
}

function serverResponse(req, res, data) {
    const allowOrigins = [
        "http://localhost:5173",
        "https://minhnnf8.github.io",
        "http://127.0.0.1:5173"
    ];

    const origin = req.headers.origin;

    if (allowOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Content-Type", "application/json");
    res.statusCode = data.status;

    res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {

    const allowOrigins = [
        "http://localhost:5173",
        "https://minhnnf8.github.io",
        "http://127.0.0.1:5173"
    ];
    
    const origin = req.headers.origin;

    if (allowOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

     if (req.method === "OPTIONS") {
        res.statusCode = 204;
        return res.end();
    }

    let response = {
        status: 200
    }

    // [GET] /api/tasks

    if (req.method === "GET" && req.url === "/api/tasks") {
        response.data = db.tasks;
        return serverResponse(req, res, response);
    }

    // [GET] /api/tasks/:id
    if (req.method === "GET" && req.url.startsWith("/api/tasks/")) {
        const id = +req.url.split("/").pop();
        const task = db.tasks.find(_task => _task.id === id);

        if (task) {
            response.data = task;
        } else {
            response.status = 404;
            response.message = "Resource not found!";
        }
    }
    // [POST] /api/tasks
    if (req.method === "POST" && req.url === "/api/tasks/") {
        let body = "";
        req.on("data", (buffer) => {
            body += buffer.toString(); // convert Buffer to string
        });
        req.on("end", () => {
            const payload = JSON.parse(body);
            const newTask = {
                id: taskId++,
                title: payload.title,
                isCompleted: false
            }
            db.tasks.push(newTask);
            response.status = 201;
            response.data = newTask;
            serverResponse(req, res, response);
        })
        return;
    }
    
    // [PUT] /api/tasks/:id
    if (req.method === "PUT" && req.url.startsWith("/api/tasks/")) {
        const id = +req.url.split("/").pop();
        let body = "";
        req.on("data", (buffer) => {
            body += buffer.toString(); // convert Buffer to string
        });
        req.on("end", () => {
            const payload = JSON.parse(body);
            const newTask = {
                title: payload.title,
                isCompleted: payload.isCompleted
            }
            const task = db.tasks.find(_task => _task.id === id)

            if (task) {
                const idx = db.tasks.findIndex(_task => _task.id === id);
                if (idx !== -1) {
                    db.tasks[idx] = {
                        ...task,
                        ...newTask
                    }
                    response.data = db.tasks[idx];
                    response.status = 200;
                } else {
                    response.status = 404;
                    response.message = "Index is out of range."
                }
            } else {
                response.status = 404;
            }
            serverResponse(req, res, response);
        });
        return;
    }

    // [DELETE] /api/tasks/:id
    if (req.method === "DELETE" && req.url.startsWith("/api/tasks/")) {
        const id = +req.url.split("/").pop();
        const task = db.tasks.find(_task => _task.id === id);
        if (task) {
            const idx = db.tasks.findIndex(_task => _task.id === id);
            if (idx !== -1){
                db.tasks.splice(idx, 1);
                response.status = 204;
            } else {
                response.status = 404;
                response.message = "Resource not found";
            }
        } else {
            response.status = 404;
            response.message = "Resource not found";
        };
        serverResponse(req, res, response);
        return;
    }
})

server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000")
})