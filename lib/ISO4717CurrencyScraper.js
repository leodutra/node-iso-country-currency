const got = require('got')
const { convertCSVToJSON } = require('./utils')

// SOURCE: https://github.com/datasets/currency-codes/blob/master/data/codes-all.csv

const DOMAIN = 'https://raw.githubusercontent.com'
const DATASET_URN = '/datasets/currency-codes/master/data/codes-all.csv'

module.exports =
    class ISO4717CurrencyScraper {
        static async scrapRemoteData() {
            try {
                console.log(`Scraping ISO-4717 data from ${DOMAIN + DATASET_URN}`)
                const csv = (await got(DOMAIN + DATASET_URN)).body
                console.log(`\nParsing ISO-4717 data...`)
                return convertCSVToJSON(csv, ',')
            }
            catch(error) {
                console.log(error)
            }
        }
    }