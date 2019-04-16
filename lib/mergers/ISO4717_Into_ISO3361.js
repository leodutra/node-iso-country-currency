const { allPromisesProgress } = require('../utils')

module.exports =

    class ISO4717_Into_ISO3361 {
        static async merge(iso3361, iso4717) {
            console.log(`Merging ISO4717 into ISO3361...`)
            return allPromisesProgress(
                `Merged ISO data:`,
                iso3361.map(country => {
                    country = { ...country }
                    for (const currency of iso4717) {
                        if (normalize(country.countryName) === normalize(currency.entity)) {
                            country.currencies = country.currencies || []
                            country.currencies.push({ ...currency })
                        }
                    }
                    return country
                })
            )
        }
    }


function normalize(text) {
    return text.toLowerCase()
        .replace(/[-,_'"()]/g, '')
        .replace(/\r?\n|\s+/g, '\u0020')
        .trim()
}