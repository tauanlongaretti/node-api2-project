const express = require('express');

const db = require('./db.js');

const router = express.Router();

// GET - All posts
router.get('/', (req, res) => {
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

module.exports = router;