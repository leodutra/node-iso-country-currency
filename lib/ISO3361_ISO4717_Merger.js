
import ISO3361CountryScrapper from './ISO3361CountryScrapper'
import ISO4717CurrencyScrapper from './ISO4717CurrencyScrapper'

export default class ISO3361_ISO4717_Merger {

  static merge(iso3361, iso4717) {
    iso4717.forEach(currency => {
      iso3361.forEach(country => {
        if (country.countryName.toLowerCase() === currency.entity.toLowerCase()) {
          country.currencies = country.currencies || [];
          country.currencies.push({
            currency: currency.currency,
            alphabeticCode: currency.alphabeticCode,
            numericCode: currency.numericCode,
            minorUnit: currency.minorUnit,
            withdrawalDate: currency.withdrawalDate,
            remark: currency.remark
          })
        }
      })

    })
      return iso3361
  }
}
