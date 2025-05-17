const express = require("express");
const router = express.Router();

router.get('/', (req,res)=>{
    res.send("Get for users");
});

router.get('/:id', (req,res)=>{
    res.send("Get for show");
});

router.post('/', (req,res)=>{
    res.send("post for users");
});

router.delete('/:id', (req,res)=>{
    res.send("Delete for users");
});

module.exports = router;