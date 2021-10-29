const express = require("express");
const app = express();
const path = require("path");
const os = require("os");
const process = require("process");
const sendFileOptions = { root: path.join(__dirname) };
const fs = require("fs");
const sqlite3=require("sqlite3").verbose();
const db = new sqlite3.Database('cities.db')

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("Hello.txt", sendFileOptions, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent:", "Hello.txt");
    }
  });
});

app.get('/cities', (req, res) => {
    res.set({ 'Content-Type': 'text/plain; charset=utf-8' });
    const sql = 'select * from cities';
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({'error': err.message});
          return;
        }
        if (!rows) {
          res.status(204).json({'error': 'No cities found'});
          return;
        }
        res.send(rows);
    });
});

app.get('/city/:id', (req, res) => {
    const sql = 'select * from cities where id = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({'error':err.message});
          return;
        }
        if (!row) {
          res.status(204).json({'error': 'City not found'});
          return;
        }
        res.send(row);
    });
});


app.get("/*.*", (req, res) => {
  var script_name = req.url.replace("/", "");
  if (fs.existsSync(script_name)) {
    console.log("Sent:", req.headers.referer);
    res.sendFile(script_name, sendFileOptions, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent:", script_name);
      }
    });
  } else {
    res.status(404).sendFile(__dirname + '/404.html');
  }
});

app.use(function(req, res) {
  //res.status(404).send('404: Page not found');
  res.status(404).sendFile(__dirname + '/404.html');
});

app.listen(process.env.PORT, err => {
  if (err) console.log(err);
  console.log("Server listening on", os.hostname + ":" + process.env.PORT);
});
