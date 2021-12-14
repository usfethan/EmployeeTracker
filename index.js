const express = require("express");
const mysql = require("mysql2");
const cTable = require("console.table");
const fs = require("fs");
const exp = require("constants");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Fn04061241*",
        database: "employeetracker_db",
    },
    console.log("Connected to the database!")
);


app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});