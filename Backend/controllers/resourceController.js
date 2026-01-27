const Resource = require('../models/Resource');

exports.addResource = async (req, res) => {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
};

exports.getAllResources = async (req, res) => {
    const resources = await Resource.find();
    res.json(resources);
};