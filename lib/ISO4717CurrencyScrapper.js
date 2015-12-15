import parse from 'csv-parser';
import { request } from './utils';



export default class ISO4717CurrencyScrapper {
  static async scrapRemoteData(callback) {

    // https://github.com/datasets/currency-codes/blob/master/data/codes-all.csv
    let source = await scrap_github_datasets_currencyCodes();
    if (typeof callback === 'function') callback(source);
  }
}

class ISO4717CurrencyDescriptor {

    setAll(entity = '', currency = '', alphabeticCode = '', numericCode = '', minorUnit = '', withdrawalDate = '', remark = '') {
      this.entity = entity;
      this.currency = currency;
      this.alphabeticCode = alphabeticCode;
      this.numericCode = numericCode;
      this.minorUnit = minorUnit;
      this.withdrawalDate = withdrawalDate;
      this.remark = remark;
    }
}

async function scrap_github_datasets_currencyCodes() {
  // Entity,Currency,AlphabeticCode,NumericCode,MinorUnit,WithdrawalDate,Remark

  const csv = await request({hostname: 'rawgit.com', path: '/datasets/currency-codes/master/data/codes-all.csv'});

  const lines = csv.split('\n');

  const currencies = [];

  let count = 0;

  lines.forEach(async function(line)  {
    if (count ++) {
      const currency = new ISO4717CurrencyDescriptor();
      currency.setAll(... line.split(','));
      if (currency.entity) currencies.push(currency);
    }
  });

  return currencies;
}
