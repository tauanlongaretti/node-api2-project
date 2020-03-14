const express = require("express");

const db = require('./data/db.js');

const dbRouter = require("./data/db-router.js");

const server = express();

server.use(express.json());

server.use("/api/posts", dbRouter);

server.get('/', (req, res) => {
    console.log(req.query);
    db.find(req.query)
        .then(posts => {
          res.status(200).json(posts);
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({ message: "Error retrieving the posts" });
        });
  });

module.exports = server;