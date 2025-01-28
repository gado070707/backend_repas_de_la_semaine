var express = require('express');
var router = express.Router();
const { afficherLeMode } = require('../controller/controllerModes');


router.get('/', afficherLeMode);
router.post('/', afficherLeMode);



module.exports = router;