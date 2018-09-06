const axios = require('axios');
const fs = require('fs');
const csv = require('fast-csv');

const externalApi = require('../config/ExternalApi');

exports.index = function(req,res) {
	res.sendFile('index.html');
};

exports.get_all_currency = async function(req, res) {

	var getCurrency = axios.get(externalApi.getAllCurrency);

	try{
		var getCurrencyResponse = await getCurrency
		var jsonResponse = {
			status: 'error',
			data: 'api response error'
		}

		if(getCurrencyResponse){
			if (getCurrencyResponse.data) {
				if (getCurrencyResponse.data.results) {
					jsonResponse = {
					status: 'success',
					data: getCurrencyResponse.data.results
					}
					jsonResponse = JSON.stringify(jsonResponse);
				}
			}
		}

	} catch (error) {
		jsonResponse = {
			status: 'error',
			data: 'Internal Server Error'
		}
	}

	res.setHeader('Content-Type', 'application/json');
	res.send(jsonResponse);

};


exports.convert_currency = async function(req,res) {
	var currencyFrom = req.body.from
	var currencyTo = req.body.to
	var amount = req.body.amount
	var currencyConvertUrl = externalApi.convertCurrency
							.replace("{{from}}",currencyFrom)
							.replace("{{to}}",currencyTo)

	var convertCurrency = axios.get(currencyConvertUrl)

	try{
		var convertCurrencyResponse = await convertCurrency

		var jsonResponse = {
			status: 'error',
			data: 'api response error'
		}

		if(convertCurrencyResponse) {
			if(convertCurrencyResponse.data) {
				if (convertCurrencyResponse.data[currencyFrom + '_' + currencyTo]){

					var convertedCurrency = amount * convertCurrencyResponse.data[currencyFrom + '_' + currencyTo].val

					jsonResponse = {
						status: 'success',
						data: convertedCurrency
					}
				}
			}
		}
	} catch (error) {
		console.log(error)
		jsonResponse = {
			status: 'error',
			data: 'Internal Server Error'
		}
	}

	res.setHeader('Content-Type', 'application/json');
	res.send(jsonResponse);
}

exports.convert_multi_currency = async function(req,res) {
	var arrCurrency = req.body.arrCurrencyToConvert;
	var amount = req.body.amount;
	var currencyFrom = req.body.from;
	var arrTempConvertCurr = [];
	var arrDataResponse = []
	for (let index in  arrCurrency) {
		let counter = ++index;
		arrTempConvertCurr.push(currencyFrom + '_' + arrCurrency[counter - 1].name)
		if((counter%2 == 0 )|| (arrCurrency.length == counter)){
			var strcurrency = arrTempConvertCurr + '';

			var convertMultiCurrency =  axios.get(externalApi.convertCurrency.replace("{{from}}_{{to}}",strcurrency))							

			try{
				var convertMultiCurrencyResponse = await convertMultiCurrency

				var jsonResponse = {}

				if (convertMultiCurrencyResponse) {
					if (convertMultiCurrencyResponse.data[currencyFrom + '_' + arrCurrency[counter - 1].name]) {
						var splitStrcurrency = strcurrency.split(',')
						for (let info of splitStrcurrency) {
							let toCurrency = info.split('_');
							let tempCurrencyValue = {
								currency: toCurrency[1],
								val: convertMultiCurrencyResponse.data[info].val * req.body.amount
							} 
							arrDataResponse.push(tempCurrencyValue)
						}
					}
				}

			} catch (error) {
				console.log(error)
				
				var jsonResponse = {
					status: 'error',
					data: 'Internal Server Error'
				}

				res.setHeader('Content-Type', 'application/json');
				res.send(jsonResponse);
			}
			arrTempConvertCurr = [];
		}
	}

	var jsonResponse = {
		status: 'success',
		data: arrDataResponse
	}

	res.setHeader('Content-Type', 'application/json');
	res.send(jsonResponse);

}

exports.get_csv = function(req,res) {

	res.setHeader('Content-disposition', 'attachment; filename=currency.csv');
  	res.setHeader('content-type', 'text/csv');
  	var csvStream = csv.createWriteStream({headers: true, objectMode: true});
  	csvStream.pipe(res);
 	csvStream.write({'col1':'val1', 'col2':'val2'});
 	csvStream.end();
}	