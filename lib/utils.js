
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
