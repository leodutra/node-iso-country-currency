
import UNECEScrapper from './lib/UNECEScrapper';
import ISO4717CurrencyScrapper from './lib/ISO4717CurrencyScrapper';
import fs from 'fs';

console.log('SCRAPPING STARTED')

UNECEScrapper.scrapRemoteData((data) => {

	fs.writeFile("ISO-3361.json", JSON.stringify(data, null, 4), (err) => {

			if(err) {
					return console.log(err);
			}

			console.log("SUCCESSFUL ISO-3361 SCRAPPING!");
	});
});

ISO4717CurrencyScrapper.scrapRemoteData((data) => {

	fs.writeFile("ISO-4717.json", JSON.stringify(data, null, 4), (err) => {

			if(err) {
					return console.log(err);
			}

			console.log("SUCCESSFUL ISO-4717 SCRAPPING!");
	});
});
