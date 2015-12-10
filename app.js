
import UNECEScrapper from './lib/UNECEScrapper';
import fs from 'fs';

new UNECEScrapper().scrapRemoteData((data) => {

	fs.writeFile("ISO-3361.json", JSON.stringify(data, null, 4), function(err) {

			if(err) {
					return console.log(err);
			}

			console.log("SCRAP SUCCESSFUL!");
	});
});
