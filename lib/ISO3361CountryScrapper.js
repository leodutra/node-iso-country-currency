import cheerio from 'cheerio';
import { request } from './utils';

const DOMAIN_UNECE = "www.unece.org";

export default class ISO3361RegionScrapper {

  static async scrapRemoteData(callback) {
    if (typeof callback === 'function') callback(await scrap_unece_org());
  }
}


async function scrap_unece_org() {
  return new Promise(async function (resolve, reject) {

    let source;
    try {
      source = await request({ host: DOMAIN_UNECE, path: '/cefact/locode/subdivisions.html' });
    }
    catch(e) {
      reject(e);
    }


    const $ = cheerio.load(source);
    const links = $('.contenttable tbody tr');
    const countries = [];

    $('.contenttable tbody tr').each((i, row) => {

      const cell = $(row).find('td');
      const hasLink = cell.eq(1).find('a').length;

      countries.push({
        'hasLink': hasLink,
        'isocode': cell.eq(0).text(),
        'countryName': cell.eq(1).find('a').text() || cell.eq(1).text(),
        'link': hasLink ? cell.eq(1).find('a').attr('href') : ''
      });
    });

    //console.log(countries)
    //console.log('\n------------------\n')

    let processCount = countries.length;

    countries.forEach(async function (country) {
      if (country.hasLink) {

        let data;
        try {
          data = await request({ host: DOMAIN_UNECE, path: country.link});
        }
        catch(e) {
          return reject(e);
        }

        const $ = cheerio.load(data);
        const subdivisions = [];

        let ruleOK = false;

        $('table').each( (i, table) => {

          const headerCells = $(table).find('tr').first().find('td');

          if (headerCells.eq(0).text().trim().indexOf('Country') !== -1 &&
            headerCells.eq(1).text().trim().indexOf('Subdivision') !== -1 &&
            headerCells.eq(2).text().trim().indexOf('Name') !== -1 &&
            headerCells.eq(3).text().trim().indexOf('Level') !== -1) {
            ruleOK = true;

            $(table).find('tr').each((i, row) => {
              if (i > 0) {
                const cells = $(row).find('td');

                subdivisions.push({
                  ISO_3166_2: cells.eq(0).text().trim() + '-' + cells.eq(1).text().trim(),
                  ISO_3166_2_short: cells.eq(1).text().trim(),
                  subdivisionName: cells.eq(2).text().trim(),
                  subdivisionLevel: cells.eq(3).text().trim()
                });
              }
            });
          }

        });

        country.subdivisions = subdivisions;

        if (!ruleOK) {
          throw new Error('FAILED RULE FOR ' + country.isocode);
        }

        delete country.hasLink;
        delete country.link;
      } else {
        country.subdivisions = [];
        delete country.hasLink;
        delete country.link;
      }
      if (--processCount < 1) return resolve(countries);
    });
  });
}
