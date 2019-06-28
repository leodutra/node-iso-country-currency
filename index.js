
const ISO3361CountryScrapper = require('./lib/ISO3361CountryScrapper')
const ISO4717CurrencyScrapper = require('./lib/ISO4717CurrencyScrapper')
const ISO4717_Into_ISO3361 = require('./lib/mergers/ISO4717_Into_ISO3361')
const WikipediaScrapper = require('./lib/WikipediaScrapper')

const { writeFileAsync } = require('./lib/utils')

async function main() {

	console.log('Scrapping started')

	const [
		{ currencyListEn, currencyListPt },
		{ iso3361, iso4717, ISO4717_into_ISO3361 }
	] = await Promise.all([
		scrapWikipediaCurrencyLists(),
		scrap_ISO4717_into_ISO3361()
	])

	console.log('DONE!')
}

async function scrapWikipediaCurrencyLists() {
	const [currencyListEn, currencyListPt] = await Promise.all([ 
		scrapCurrencyListEn(),
		scrapCurrencyListPt()
	])
	return { currencyListEn, currencyListPt }
}

async function scrap_ISO4717_into_ISO3361() {
	const [iso4717, iso3361] = await Promise.all([ 
		scrapISO4717(), 
		scrapISO3361()
	])
	
	const ISO4717_into_ISO3361 = await ISO4717_Into_ISO3361.merge(iso3361, iso4717)
	await writeFileAsync('ISO-3361-ISO-4717.json', JSON.stringify(ISO4717_into_ISO3361, null, 4))
	console.log("Successful merge of ISO-4717 into ISO-3361.")

	return { iso3361, iso4717, ISO4717_into_ISO3361 }
}

async function scrapISO3361() {
	console.log("\nISO-3361 scrapping started...")
	const t = Date.now()
	const data = await ISO3361CountryScrapper.scrapRemoteData()
	console.log("\nSuccessful ISO-3361 scrapping.")
	await writeFileAsync("ISO-3361.json", JSON.stringify(data, null, 4))
	console.log("Successful ISO-3361 write.")
	console.log('--- elapsed ---', Date.now() - t)
	return data
}

async function scrapISO4717() {
	console.log("\nISO-4717 scrapping started...")
	const data = await ISO4717CurrencyScrapper.scrapRemoteData()
	console.log("\nSuccessful ISO-4717 scrapping.")
	await writeFileAsync("ISO-4717.json", JSON.stringify(data, null, 4))
	console.log("Successful ISO-4717 write.")
	return data
}

async function scrapCurrencyListEn() {
	console.log("\nCurrency list (English) scrapping started...")
	const data = await WikipediaScrapper.scrapCurrencyListEn()
	console.log("\nSuccessful Currency list (English) scrapping.")
	await writeFileAsync("wikipedia-currency-list-en.json", JSON.stringify(data, null, 4))
	console.log("Successful Currency list (English) write.")
	return data
}

async function scrapCurrencyListPt() {
	console.log("\nCurrency list (Portuguese) scrapping started...")
	const data = await WikipediaScrapper.scrapCurrencyListPt()
	console.log("\nSuccessful Currency list (Portuguese) scrapping.")
	await writeFileAsync("wikipedia-currency-list-pt.json", JSON.stringify(data, null, 4))
	console.log("Successful Currency list (Portuguese) write.")
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