
const ISO3361CountryScrapper = require('./lib/ISO3361CountryScrapper')
const ISO4717CurrencyScrapper = require('./lib/ISO4717CurrencyScrapper')
const ISO4717_Into_ISO3361 = require('./lib/mergers/ISO4717_Into_ISO3361')

const { writeFileAsync } = require('./lib/utils')

async function main() {

	console.log('Scrapping started')

	const [iso4717, iso3361] = await Promise.all([ scrapISO4717(), scrapISO3361() ])
	
	await writeFileAsync(
		"ISO-3361-ISO-4717.json",
		JSON.stringify(await ISO4717_Into_ISO3361.merge(iso3361, iso4717), null, 4)
	)
	
	console.log("Successful merge of ISO-4717 into ISO-3361.")
}

async function scrapISO3361() {
	const t = Date.now()
	const data = await ISO3361CountryScrapper.scrapRemoteData()
	console.log("\nSuccessful ISO-3361 scrapping.")
	await writeFileAsync("ISO-3361.json", JSON.stringify(data, null, 4))
	console.log("Successful ISO-3361 write.")
	console.log('--- elapsed ---', Date.now() - t)
	return data
}

async function scrapISO4717() {
	const data = await ISO4717CurrencyScrapper.scrapRemoteData()
	console.log("\nSuccessful ISO-4717 scrapping.")
	await writeFileAsync("ISO-4717.json", JSON.stringify(data, null, 4))
	console.log("Successful ISO-4717 write.")
	return data
}

(async () => {
	try {
		main()
	}
	catch(error) {
		console.log(error)
	}
})()