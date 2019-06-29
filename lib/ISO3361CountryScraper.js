const got = require('got')
const https = require('https')
const cheerio = require('cheerio')
const { allPromisesProgress } = require('./utils')

const DOMAIN_UNECE = 'https://www.unece.org'
const SUBDIVISIONS_URN = '/cefact/locode/subdivisions.html'

module.exports =

	class ISO3361RegionScraper {

		static async scrapRemoteData() {
			const agent = new https.Agent({ keepAlive: true })

			console.log(`Scraping ISO-3361 data from ${DOMAIN_UNECE + SUBDIVISIONS_URN}`)
			const source = (await got(DOMAIN_UNECE + SUBDIVISIONS_URN, { agent })).body
			
			console.log(`\nParsing ISO-3361 data...`)
			const $ = cheerio.load(source)
			console.log(`\nISO-3361 data parsed.`)

			console.log(`\nTransversing ISO-3361 data...`)
			const countries = $('.contenttable tbody tr').map((i, row) => {
				const cells = $(row).find('td')
				const link = cells.eq(1).find('a').eq(0)
				
				return {
					'hasLink': link.length,
					'isocode': cells.eq(0).text(),
					'countryName': link.text() || cells.eq(1).text(),
					'link': link.attr('href')
				}
			}).get()
			console.log(`\nISO-3361 data transversed.`)
			
			console.log('\nIt will scrap country data from multiple links (takes some time)...')
			return allPromisesProgress(
				'Scraping country details (ISO-3361):',
				countries.map(country => fetchCountryDetails(country, agent))
			)
		}
	}

async function fetchCountryDetails(country, agent) {
	const subdivisions = []
	if (country.hasLink) {
		const $ = cheerio.load(
			(await got(DOMAIN_UNECE + country.link, { agent })).body
		)
			
		let isTransversingOk = false

		$('table').each((i, table) => {

			const headerCells = $(table).find('tr').first().find('td')
			if (
				headerCells.eq(0).text().trim().toLowerCase().indexOf('country') === -1 ||
				headerCells.eq(1).text().trim().toLowerCase().indexOf('subdivision') === -1 ||
				headerCells.eq(2).text().trim().toLowerCase().indexOf('name') === -1 ||
				headerCells.eq(3).text().trim().toLowerCase().indexOf('level') === -1
			) {
				return
			}

			$(table).find('tr').each((rowIndex, row) => {
				if (rowIndex === 0) {
					return
				}
				const cells = $(row).find('td')
				subdivisions.push({
					ISO_3166_2: cells.eq(0).text().trim() + '-' + cells.eq(1).text().trim(),
					ISO_3166_2_short: cells.eq(1).text().trim(),
					subdivisionName: cells.eq(2).text().trim(),
					subdivisionLevel: cells.eq(3).text().trim()
				})
				isTransversingOk = true
			})
		})
		if (!isTransversingOk) {
			throw new Error(`${country.isocode} country data transversing failed.`)
		}
	}
	return {
		isocode: country.isocode,
		countryName: country.countryName,
		subdivisions
	}
}