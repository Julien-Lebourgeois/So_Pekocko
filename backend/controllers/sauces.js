const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    console.log(req.body.sauce);
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file?
    {
        ...JSON.parse(req.body.Sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id:req.params.id})
        .then(Sauce => {
            const filename = Sauce.imageUrl.split('/image/')[1];
            fs.unlink(`image/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({ error })); 
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

exports.addLikeDislike = (req, res, next) => {
    const like = req.body.like
    const user = req.body.userId
    const sauceId = req.params.id
    // Ajout du like
    if (like === 1) { 
      Sauce.updateOne(
        { _id: sauceId },
        {
          $push: { usersLiked: user },
          $inc: { likes: like },
        }
      )
        .then(() => res.status(200).json({ message: 'Like ajouté !' }))
        .catch((error) => res.status(400).json({ error }))
    }
    // Ajout du dislike
    if (like === -1) {
      Sauce.updateOne( 
        { _id: sauceId },
        {
          $push: { usersDisliked: user },
          $inc: { dislikes: -like },
        })
        .then(() => {res.status(200).json({ message: 'Dislike ajouté !' })
        })
        .catch((error) => res.status(400).json({ error }))
    }
    // Annulation des like et/ou dislike
    if (like === 0) { 
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          // Annulation du like
          if (sauce.usersLiked.includes(user)) { 
            Sauce.updateOne(
              { _id: sauceId },
              {
                $pull: { usersLiked: user },
                $inc: { likes: -1 },
              })
              .then(() => res.status(200).json({ message: 'Like retiré !' }))
              .catch((error) => res.status(400).json({ error }))
          }
          // Annulation du dislike
          if (sauce.usersDisliked.includes(user)) { 
            Sauce.updateOne(
              { _id: sauceId },
              {
                $pull: { usersDisliked: user },
                $inc: { dislikes: -1 },
              })
              .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
              .catch((error) => res.status(400).json({ error }))
          }
        })
        .catch((error) => res.status(404).json({ error }))
    }
  };