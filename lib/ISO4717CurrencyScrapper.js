import parse from 'csv-parser';
import { request } from './utils';

export default class ISO4717CurrencyScrapper {
  static async scrapRemoteData() {
    scrap_GitHub_Datasets_CurrencyCodes((data)=>{
      console.log(data)
    });
  }
}

// https://github.com/datasets/currency-codes/blob/master/data/codes-all.csv
function scrap_GitHub_Datasets_CurrencyCodes(callback) {
  request({host: 'raw.githubusercontent.com', path: '/datasets/currency-codes/master/data/codes-all.csv'}, (data)=> {
    if (typeof callback === 'function') callback(data);
  });
}
