var express = require('express');
var router = express.Router();
const { afficherViandes, afficherViande, supprimerViande, ajouterViande } = require('../controller/controllerViandes')

/* GET viandes page. */
router.get('/', afficherViandes);
router.get('/viande', afficherViande);
router.post('/ajouter', ajouterViande);
router.delete('/supprimer', supprimerViande);

module.exports = router;