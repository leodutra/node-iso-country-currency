
import UNECEScrapper from './lib/UNECEScrapper';
import ISO4717CurrencyScrapper from './lib/ISO4717CurrencyScrapper';
import fs from 'fs';

UNECEScrapper.scrapRemoteData((data) => {

	fs.writeFile("ISO-3361.json", JSON.stringify(data, null, 4), (err) => {

			if(err) {
					return console.log(err);
			}

			console.log("ISO-3361 SCRAP SUCCESSFUL!");
	});
});

ISO4717CurrencyScrapper.scrapRemoteData((data) => {

	fs.writeFile("ISO-4717.json", JSON.stringify(data, null, 4), (err) => {

			if(err) {
					return console.log(err);
			}

			console.log("ISO-4717 SCRAP SUCCESSFUL!");
	});
});
