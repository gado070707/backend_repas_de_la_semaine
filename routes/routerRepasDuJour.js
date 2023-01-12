var express = require('express');
var router = express.Router();
var routerRepasDuJourLundi = require('./routerRepasDuJourLundi');
var routerRepasDuJourMardi = require('./routerRepasDuJourMardi');
var routerRepasDuJourMercredi = require('./routerRepasDuJourMercredi');

router.use('/lundi', routerRepasDuJourLundi);
router.use('/mardi', routerRepasDuJourMardi);
router.use('/mercredi', routerRepasDuJourMercredi);

module.exports = router;