const { Image } = require('./../models');
const ctrls = {}

ctrls.index = async(req, res) => {
    const images = await Image.find({}).sort({ timestamp: -1 });
    res.render('index', { images });
}

module.exports = ctrls;