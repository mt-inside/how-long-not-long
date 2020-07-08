import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

var app = express();

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.get("/deadline", (req, res, next) => {
    fs.readFile(path.join(__dirname, "deadline.txt"), { encoding: 'utf-8' }, function(err, data) {
        if (!err) {
            res.json({ deadline: data.trim() });
        } else {
            console.log(err);
        }
    });
});

app.get("/quotes", (req, res, next) => {
    fs.readFile(path.join(__dirname, "quotes.json"), { encoding: 'utf-8' }, function(err, data) {
        if (!err) {
            let d = JSON.parse(data);
            console.log(d);
            res.json({ quotes: d });
        } else {
            console.log(err);
        }
    });
});
