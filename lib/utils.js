
import http from 'http';

export * from 'babel-polyfill'; // required by Babel.js async+await (ES7)

export function request(options, callback) {

	return new Promise(function(resolve, reject) {

	 	const clientRequest = http.request(options, (response) => {

			let responseText = '';

			//another chunk of data has been recieved, so append it to `str`
			response.on('data', (chunk) => responseText += chunk);

			//the whole response has been recieved, so we just print it out here
			response.on('end', () => resolve(responseText));

		});

		clientRequest.on('error', reject);
		clientRequest.end();
	});
}

export function convertCSVToJSON(source, splitPattern = ",", jsonPattern) {
	const result = [];
	//	console.log('ok', typeof source === 'string' && Array.isArray(jsonPattern), source.split(/\r?\n/im).length)
	if (typeof source === 'string' && Array.isArray(jsonPattern)) {
		source.split(/\r?\n/im).forEach( (line) => {
		//	console.log('line')
			const values = line.split(splitPattern);
			const keyValues = {}
			jsonPattern.forEach( (jsonProperty, index) =>{
	//			console.log(jsonProperty)
				if (jsonProperty) {
					keyValues[jsonProperty] = values[index] || '';
				}
			})
			if (Object.keys(keyValues).length) result.push(keyValues);
		})
	}
	else {
		throw new Error('Invalid arguments');
	}
//	console.log(result)
	return result;
}
