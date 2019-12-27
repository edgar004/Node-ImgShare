//MODELOS
const { Image } = require('../models');

const path = require('path');
const { randomName } = require('../helpers/libs');
const fs = require('fs-extra');
const ctrls = {}

ctrls.index = (req, res) => {
    res.send('Index pag');
}

ctrls.create = async(req, res) => {

    const file = req.file;
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    const imgTemPath = file.path;

    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.git') {

        let imgUrl = randomName();
        const validarNombre = async() => {
            const resp = await Image.findOne({ filename: imgUrl });
            if (resp) {
                imgUrl = randomName();
                validarNombre();
            } else {
                const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
                //Mueve un archivo a la ubicacion dada 
                await fs.rename(imgTemPath, targetPath);
                const newImg = new Image({
                    title: req.body.title,
                    filename: `${imgUrl}${ext}`,
                    description: req.body.description
                });
                await newImg.save()
                res.redirect('/')
            }
        }

        validarNombre();

    } else {
        await fs.unlink(imgTemPath);
        res.status(500).json({ error: 'La imagen no cumple con el formato valido' });
    }


}

ctrls.like = (req, res) => {}

ctrls.comment = (req, res) => {}

ctrls.remove = (req, res) => {}




module.exports = ctrls;