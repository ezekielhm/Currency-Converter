var express = require('express');
var router = express.Router();

var currency_controller = require('./controller/CurrencyController');
 
router.get('/',currency_controller.index);

router.get('/currency/getAll', currency_controller.get_all_currency);

router.post('/currency/convert', currency_controller.convert_currency);

router.post('/currency/multiConvert',currency_controller.convert_multi_currency);

router.get('/currency/getCsv', currency_controller.get_csv);

module.exports = router;