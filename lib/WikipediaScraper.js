const got = require('got')
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser')

const WIKIPEDIA_EN = 'https://en.wikipedia.org'
const WIKIPEDIA_PT = 'https://pt.wikipedia.org'

const CURRENCY_LIST_EN = '/wiki/List_of_circulating_currencies'
const CURRENCY_LIST_PT = '/wiki/Lista_de_moedas'

module.exports =

	class ISO3361RegionScraper {

		static async scrapCurrencyListEn() {
			console.log(`Currency list (English) from Wikipedia (${WIKIPEDIA_EN + CURRENCY_LIST_EN})`)
			const source = (await got(WIKIPEDIA_EN + CURRENCY_LIST_EN)).body

			console.log(`\nParsing currency list data (English) ...`)
			const $ = cheerio.load(source)
			cheerioTableparser($)
			console.log(`\nCurrency list data (English) parsed.`)
			console.log(`\nTransversing currency list data (English)...`)
			const data = []
			const flagicon = url => url ? 'http' + url : url
			const countryLink = url => url ? WIKIPEDIA_EN + url : url
			columnsToRows($('table.wikitable').first().parsetable(true, true, false)).forEach((row, i) => {
				if (i === 0) return
				const $tds = row.map(x => $(`<td>${x}</td>`))
				if ($tds.length > 1) {
					data.push({
						flagicon: flagicon($tds[0].find('.flagicon > img').first().attr('src')),
						countryName: $tds[0].text().trim(),
						countryLink: countryLink($tds[0].find('a').first().attr('href')),
						currencyName: $tds[1].text().trim(),
						symbol: $tds[2].text().trim(),
						currencyISOCode: $tds[3].text().trim(),
						fractionalUnit: $tds[4].text().trim(),
						numberToBasic: $tds[5].text().trim(),
					})
				} 
				else {
					console.log('Invalid currency list row:', '\n', row)
				}
			})
			console.log(`\nCurrency list data (English) transversed.`)
			return data
		}

		static async scrapCurrencyListPt() {
			console.log(`Currency list (Portuguese) from Wikipedia (${WIKIPEDIA_PT + CURRENCY_LIST_PT})`)
			const source = (await got(WIKIPEDIA_PT + CURRENCY_LIST_PT)).body

			console.log(`\nParsing currency list data (Portuguese) ...`)
			const $ = cheerio.load(source)
			cheerioTableparser($)
			
			console.log(`\nCurrency list data (Portuguese) parsed.`)

			console.log(`\nTransversing currency list data (Portuguese)...`)
			const data = []
			const flagicon = url => url ? 'http' + url : url
			const countryLink = url => url ? WIKIPEDIA_PT + url : url
			columnsToRows($('table.wikitable').first().parsetable(true, true, false)).forEach((row, i) => {
				if (i === 0) return
				const $tds = row.map(x => $(`<td>${x}</td>`))
				if ($tds.length > 1) {
					data.push({
						flagicon: flagicon($tds[0].find('.flagicon > img').first().attr('src')),
						countryName: $tds[0].text().trim(),
						countryLink: countryLink($tds[0].find('a').first().attr('href')),
						currencyName: $tds[1].text().trim(),
						symbol: $tds[2].text().trim(),
						currencyISOCode: $tds[3].text().trim(),
						fractionalUnit: $tds[4].text().trim(),
						numberToBasic: $tds[5].text().trim(),
					})
				} 
				else {
					console.log('Invalid currency list row:', '\n', row)
				}
			})
			console.log(`\nCurrency list data (Portuguese) transversed.`)
			return data
		}
	}


function columnsToRows(parsedTableColumns) {
	const rows = []
	for (let c = 0; c < parsedTableColumns.length; c++) {
		for (let r = 0; r < parsedTableColumns[c].length; r++) {
			if (rows[r] == null) {
				rows[r] = []
			}
			rows[r].push(parsedTableColumns[c][r])
		}
	}
	return rows
}