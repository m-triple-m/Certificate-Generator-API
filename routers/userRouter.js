const express = require("express");
const router = express.Router();
const Model = require("../models/userModel");


router.post("/add", (req, res) => {
    new Model(req.body).save()
    .then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(501).json(err);
    });
});

router.get("/getall", (req, res) => {
    Model.find({})
    .then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(501).json(err);
    });
});

router.get("/getbyid/:id", (req, res) => {
    Model.findById(req.params.id)
    .then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(501).json(err);
    });
});

router.put("/update/:id", (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(501).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
    Model.findByIdAndDelete(req.params.id)
    .then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(501).json(err);
    });
});

module.exports = router;
