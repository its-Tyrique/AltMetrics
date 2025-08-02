// require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin:  "http://localhost:5173",
}

app.use(cors(corsOptions));

const db = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "secret",
    database: "altmetrics_db"
})

app.get("/api", (request, response) => {
    response.json({
        data: [
            {
                title: "Sample Title",
                author: "Author Name",
                year: 2024,
                journal: "Journal Name"
            },
            {
                title: "Another Title",
                author: "Second Author",
                year: 2023,
                journal: "Another Journal"
            }
        ]
    });
});

app.get("/api/crypto" , (request, response) => {
    const sql = "SELECT * FROM crypto";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching crypto data:", err);
            response.status(500).json({ error: "Internal Server Error" });
            return;
        }
        response.json(result);
    });
});

app.listen(8080, () => {
    console.log("Server is running on port 3000");
});