const got = require('got')
const https = require('https')
const cheerio = require('cheerio')
// const { allPromisesProgress } = require('./utils')

const WIKIPEDIA_PAGE_EN = 'https://en.wikipedia.org/wiki/List_of_circulating_currencies'
const WIKIPEDIA_PAGE_PT = 'https://pt.wikipedia.org/wiki/Lista_de_moedas'

module.exports =

	class ISO3361RegionScrapper {

		static async scrapCurrencyListEn() {
			const agent = new https.Agent({ keepAlive: true })

			console.log(`Currency list (English) from Wikipedia (${WIKIPEDIA_PAGE_EN})`)
			const source = (await got(WIKIPEDIA_PAGE_EN, { agent })).body

			console.log(`\nParsing currency list data (English) ...`)
			const $ = cheerio.load(source)
			console.log(`\nCurrency list data (English) parsed.`)
			console.log(`\nTransversing currency list data (English)...`)
			const data = []
			$('table.wikitable > tbody > tr').each((i, tr) => {
				const $tds = $(tr).children('td')
				if ($tds.length) {
					data.push({
						flagicon: $tds.eq(0).find('.flagicon > img').first().attr('src'),
						countryName: $tds.eq(0).text().trim(),
						countryLink: $tds.eq(0).find('a').first().attr('href'),
						currencyName: $tds.eq(1).text().trim(),
						symbol: $tds.eq(2).text().trim(),
						currencyISOCode: $tds.eq(3).text().trim(),
						fractionalUnit: $tds.eq(4).text().trim(),
						numberToBasic: $tds.eq(5).text().trim(),
					})
				}
				return 
			})
			console.log(`\nCurrency list data (English) transversed.`)
			return data
		}

		static async scrapCurrencyListPt() {
			const agent = new https.Agent({ keepAlive: true })

			console.log(`Currency list (Portuguese) from Wikipedia (${WIKIPEDIA_PAGE_PT})`)
			const source = (await got(WIKIPEDIA_PAGE_PT, { agent })).body

			console.log(`\nParsing currency list data (Portuguese) ...`)
			const $ = cheerio.load(source)
			console.log(`\nCurrency list data (Portuguese) parsed.`)

			console.log(`\nTransversing currency list data (Portuguese)...`)
			const data = []
			$('table.wikitable > tbody > tr').each((i, tr) => {
				const $tds = $(tr).children('td')
				if ($tds.length) {
					data.push({
						flagicon: $tds.eq(0).find('.flagicon > img').first().attr('src'),
						countryName: $tds.eq(0).text().trim(),
						countryLink: $tds.eq(0).find('a').first().attr('href'),
						currencyName: $tds.eq(1).text().trim(),
						symbol: $tds.eq(2).text().trim(),
						currencyISOCode: $tds.eq(3).text().trim(),
						fractionalUnit: $tds.eq(4).text().trim(),
						numberToBasic: $tds.eq(5).text().trim(),
					})
				}
				return 
			})
			console.log(`\nCurrency list data (Portuguese) transversed.`)
			return data
		}
	}
