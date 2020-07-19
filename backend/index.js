import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

var app = express();
app.use(cors());

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/deadline", async (req, res, next) => {
    fs.readFile(path.join(__dirname, "deadline.txt"), { encoding: 'utf-8' }, function(err, data) {
        if (!err) {
            res.json({ deadline: data.trim() });
        } else {
            console.log(err);
        }
    });
});

app.get("/quotes", async (req, res, next) => {
    fs.readFile(path.join(__dirname, "quotes.json"), { encoding: 'utf-8' }, function(err, data) {
        if (!err) {
            let d = JSON.parse(data);
            res.json({ quotes: d });
        } else {
            console.log(err);
        }
    });
});
