'use strict'

const cheerio = require('cheerio')

const http = require('http');

const fs = require('fs');

request('www.unece.org', '/cefact/locode/subdivisions.html', (source) => {

	const $ = cheerio.load(source);
	const links = $('.contenttable tbody tr');
	const countries = []

	$('.contenttable tbody tr').each((i, row) => {



		let cell = $(row).find('td');
		let hasLink = cell.eq(1).find('a').length;

		countries.push({
			'hasLink': hasLink, 
			'isocode': cell.eq(0).text(), 
			'countryName': cell.eq(1).find('a').text() || cell.eq(1).text(),
			'link': hasLink ? cell.eq(1).find('a').attr('href') : ''
		});
	});


	//console.log(countries)
	//console.log('\n------------------\n')

	var asyncCount = countries.length;

	countries.forEach((country)=> {
		 if (country.hasLink) {
			 request('www.unece.org', country.link, (data) => {

			 	const $ = cheerio.load(data);
			 	const subdivisions = [];

			 	let ruleOK = false;

			 	$('table').each((i, table) => {

			 		let headerCells = $(table).find('tr').first().find('td');
			 		
			 		if (headerCells.eq(0).text().trim().indexOf('Country') !== -1 && 
			 			headerCells.eq(1).text().trim().indexOf('Subdivision') !== -1 &&
			 			headerCells.eq(2).text().trim().indexOf('Name') !== -1 &&
			 			headerCells.eq(3).text().trim().indexOf('Level') !== -1 )
			 		{
			 			ruleOK = true;

			 			$(table).find('tr').each((i, row)=> {
			 				if (i > 0) {
			 					let cells = $(row).find('td');

			 					subdivisions.push({
			 						ISO_3166_2: cells.eq(0).text().trim() + '-' + cells.eq(1).text().trim(),
			 						ISO_3166_2_short: cells.eq(1).text().trim(),
			 						subdivisionName: cells.eq(2).text().trim(),
			 						subdivisionLevel: cells.eq(3).text().trim()
			 					});
			 				}
			 			})

			 		}

			 	});

			 	country.subdivisions = subdivisions;

			 	if (!ruleOK) {
			 		console.error('FAILED RULE FOR', country.isocode)
			 	}

			 	if (--asyncCount === 0) {

			 		fs.writeFile("ISO-3361-2.json", JSON.stringify(countries, null, 4), function(err) {
					    if(err) {
					        return console.log(err);
					    }

					    console.log("SCRAP SUCCESSFUL!");
					}); 

			 	}

			 });
		}
		else {
			country.subdivisions = [];
			asyncCount--;
		}
		delete country.hasLink;
		delete country.link;
	})

	
});


function request(host, path, callback) {

	http.request({host: host, path: path}, (response) => {

	  let str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', (chunk) => str += chunk);
	  
	  //the whole response has been recieved, so we just print it out here
	  response.on('end', (n) =>  typeof callback === 'function' ? callback(str) : null );

	}).end();
}