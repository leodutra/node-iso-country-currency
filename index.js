
const ISO3361CountryScraper = require('./lib/ISO3361CountryScraper')
const ISO4717CurrencyScraper = require('./lib/ISO4717CurrencyScraper')
const ISO4717_Into_ISO3361 = require('./lib/mergers/ISO4717_Into_ISO3361')
const WikipediaScraper = require('./lib/WikipediaScraper')

const { writeFileAsync } = require('./lib/utils')

async function main() {

	console.log('Scraping started')

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
	console.log("\nISO-3361 scraping started...")
	const t = Date.now()
	const data = await ISO3361CountryScraper.scrapRemoteData()
	console.log("\nSuccessful ISO-3361 scraping.")
	await writeFileAsync("ISO-3361.json", JSON.stringify(data, null, 4))
	console.log("Successful ISO-3361 write.")
	console.log('--- elapsed ---', Date.now() - t)
	return data
}

async function scrapISO4717() {
	console.log("\nISO-4717 scraping started...")
	const data = await ISO4717CurrencyScraper.scrapRemoteData()
	console.log("\nSuccessful ISO-4717 scraping.")
	await writeFileAsync("ISO-4717.json", JSON.stringify(data, null, 4))
	console.log("Successful ISO-4717 write.")
	return data
}

async function scrapCurrencyListEn() {
	console.log("\nCurrency list (English) scraping started...")
	const data = await WikipediaScraper.scrapCurrencyListEn()
	console.log("\nSuccessful Currency list (English) scraping.")
	await writeFileAsync("wikipedia-currency-list-en.json", JSON.stringify(data, null, 4))
	console.log("Successful Currency list (English) write.")
	return data
}

async function scrapCurrencyListPt() {
	console.log("\nCurrency list (Portuguese) scraping started...")
	const data = await WikipediaScraper.scrapCurrencyListPt()
	console.log("\nSuccessful Currency list (Portuguese) scraping.")
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