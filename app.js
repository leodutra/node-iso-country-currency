
import ISO3361CountryScrapper from './lib/ISO3361CountryScrapper'
import ISO4717CurrencyScrapper from './lib/ISO4717CurrencyScrapper'
import ISO3361_ISO4717_Merger from './lib/ISO3361_ISO4717_Merger'
import fs from 'fs'

console.log('SCRAPPING STARTED')

let iso3361
let iso4717

ISO3361CountryScrapper.scrapRemoteData(data => {
	iso3361 = data
	console.log("SUCCESSFUL ISO-3361 SCRAPPING!")
	if (iso3361 && iso4717)  merge()
	fs.writeFile("out/ISO-3361.json", JSON.stringify(data, null, 4), err => {

			if(err) return console.log(err)

			console.log("SUCCESSFUL ISO-3361 WRITE!")
	});
});

ISO4717CurrencyScrapper.scrapRemoteData(data => {
	iso4717 = data
		console.log("SUCCESSFUL ISO-4717 SCRAPPING!")
	if (iso3361 && iso4717)  merge()
	fs.writeFile("out/ISO-4717.json", JSON.stringify(data, null, 4), err => {

			if(err) return console.log(err)

			console.log("SUCCESSFUL ISO-4717 WRITE!")
	});
});

function merge() {
	fs.writeFile("out/ISO-3361-merge-ISO-4717.json", JSON.stringify(ISO3361_ISO4717_Merger.merge(iso3361, iso4717), null, 4), err => {

			if(err) return console.log(err)

			console.log("SUCCESSFUL ISO-3361 ISO-4717 MERGING!")

			console.log("CHECK \"out\" FOLDER")
	});
}
