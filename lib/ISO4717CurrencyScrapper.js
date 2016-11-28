import { request, convertCSVToJSON } from './utils';

export default class ISO4717CurrencyScrapper {
  static async scrapRemoteData(callback) {
    if (typeof callback === 'function') callback( await scrap_github_datasets_currencyCodes())
  }
}

// class ISO4717CurrencyDescriptor {
//
//     setAll(entity = '', currency = '', alphabeticCode = '', numericCode = '', minorUnit = '', withdrawalDate = '', remark = '') {
//       this.entity = entity
//       this.currency = currency
//       this.alphabeticCode = alphabeticCode
//       this.numericCode = numericCode
//       this.minorUnit = minorUnit
//       this.withdrawalDate = withdrawalDate
//       this.remark = remark
//     }
// }


/* SOURCE: https://github.com/datasets/currency-codes/blob/master/data/codes-all.csv */
async function scrap_github_datasets_currencyCodes() {
  // Entity,Currency,AlphabeticCode,NumericCode,MinorUnit,WithdrawalDate,Remark

  const csv = await request({hostname: 'raw.githubusercontent.com', path: '/datasets/currency-codes/master/data/codes-all.csv'})

  // const lines = csv.split('\n')
  //
  // const currencies = []
  //
  // let count = 0
  //
  // lines.forEach(line => {
  //   if (count > 0) {
  //     const currency = new ISO4717CurrencyDescriptor()
  //     currency.setAll(... line.split(','))
  //     if (currency.entity) currencies.push(currency)
  //   }
  //   else {
  //     count++
  //   }
  // });
  //

  return convertCSVToJSON(csv, ',', ['entity', 'currency', 'alphabeticCode', 'numericCode', 'minorUnit', 'withdrawalDate', 'remark'])
}
