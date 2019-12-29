//MODELOS
const { Image, Comment } = require('../models');

const path = require('path');
const { randomName } = require('../helpers/libs');
const fs = require('fs-extra');
const md5 = require('md5');
const ctrls = {}

ctrls.index = async(req, res) => {
    const piplete = [{
        $match: { filename: { $regex: req.params.imagen_id } }
    }, {
        $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'image_id',
            as: 'comments'
        }
    }]
    let image = await Image.aggregate(piplete);
    image = image[0];
    console.log(image);



    res.render('image', { image });
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

ctrls.comment = async(req, res) => {
    const imagen = await Image.findById(req.params.imagen_id);
    if (imagen) {
        try {
            const newComment = new Comment(req.body);

            newComment.image_id = imagen._id;
            newComment.gravatar = md5(newComment.email);
            await newComment.save();
            res.redirect(`images/${imagen.uniqueId}`)

        } catch (err) {}
    }

}

ctrls.remove = (req, res) => {}




module.exports = ctrls;