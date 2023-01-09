var express = require('express');
var router = express.Router();
// var routerRepasDuJourLundi = require('./routerRepasDuJourLundi');
const { afficherRepasDuJourLundi  } = require('../controller/controllerRepasDuJourLundi')
// const { afficherRepasDuJourMardi  } = require('../controller/controllerRepasDuJourMardi')
// afficherRepasDuJourMardi

/* GET viandes page. */
// router.get('/', afficherRepasDuJourLundi);
router.use('/lundi', afficherRepasDuJourLundi);
// router.use('/mardi', afficherRepasDuJourMardi);
// router.post('/lundi/ajouter', ajouterRepasDuJourLundi);
// router.delete('/lundi/supprimer', supprimerRepasDuJourLundi);

module.exports = router;