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

// GET - Get post by ID
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

// GET - Get comments by ID
router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
        .then(comments => {
            if (comments) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "Error retrieving the comments" });
        });
})

// POST - New post
router.post('/', (req, res) => {
    const postInfo = req.body;

    db.insert(req.body)
        .then(post => {
            if (postInfo) {
                res.status(201).json({ post })
            } else {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

// POST - New comment
router.post('/:id/comments', (req, res) => {
    const { text } = req.body
    const { id } = req.params
    const commentInfo = { text: text, post_id: id }

    if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        db.findById(id)
            .then(postId => {
                if (!postId) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                } else {
                    db.insertComment(commentInfo)
                        .then((comment) => {
                            res.status(201).json({ comment })
                        })
                        .catch(() => {
                            res.status(500).json({ error: "There was an error while saving the comment to the database" })
                        })
                }
            })
    }
})

// DELETE - Delete post
router.delete('/:id', (req, res) => {
    db.remove(req.params.id)
        .then(() => {
            if (!req.params.id) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json({ message: "The post has been deleted" })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The post could not be removed" })
        })
})

// PUT - Update post
router.put('/:id', (req, res) => {
    const changes = req.body;

    db.update(req.params.id, changes)
        .then(post => {
            if (!req.params.id) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else if (!changes.title) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            } else {
                res.status(200).json({ changes })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
})

module.exports = router;

