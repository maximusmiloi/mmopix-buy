import cheerio from 'cheerio';
import Chaptersgold from '../models/chaptergold.js';
import axios from 'axios';

const getPriceG2g = async(link) => {
  try {
    const chapters = await Chaptersgold.find();
    const cookies = 'G2GSESID_V4=9kif7j6cpunlcehg95kv43tc52; noticebar_cookie=1; _gcl_au=1.1.1663142478.1722438680; history_offers=%5B%227820563%22%5D; _gid=GA1.2.377843508.1722438681; _fbp=fb.1.1722438681050.996303525807873710; _clck=1tby9df%7C2%7Cfnx%7C0%7C1673; noticebar_cookie=1; g2g_regional=%7B%22country%22%3A%22US%22%2C%22currency%22%3A%22USD%22%2C%22language%22%3A%22en%22%7D; _ga=GA1.2.1071800197.1722438680; _dc_gtm_UA-46996921-1=1; _ga_7N3SZK9ECC=GS1.2.1722438680.1.1.1722439115.60.0.0; _ga_MESX7PR0C0=GS1.1.1722438680.1.1.1722439115.60.0.0; _uetsid=5a2469f04f4f11ef8e616b188d287314; _uetvid=5a248e704f4f11efbc7cc377b58843a3; _clsk=19m8019%7C1722439116108%7C10%7C0%7Cf.clarity.ms%2Fcollect; _dd_s=rum=0&expire=1722439991324';
    const cookies1 = 'g2g_regional=%7B%22country%22%3A%22US%22%2C%22currency%22%3A%22USD%22%2C%22language%22%3A%22en%22%7D;';
    for (const chapter of chapters) {
      if (chapter.options.length > 0) {
        let isModified = false; // Флаг для отслеживания изменений
        for (const option of chapter.options) {
          const regex = /g2g\.com/;
          if (regex.test(option[1])) {
            const fetchOptions = {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'Cookie': cookies1
              },
              responseType: 'text',
              method: 'GET',
            };
            try {
              console.log(option[1][0])
              link = option[1][0].trim();
              const requestG2GPrice = await axios(`${link}&sort=lowest_price`, fetchOptions);
              const responseG2GPrice = await requestG2GPrice.data;
              
              const $ = cheerio.load(responseG2GPrice);
              
              const priceContainer = $(`.other-seller-offeer_mainbox`);
              const prices = priceContainer.find('.other_offer-desk-main-box');
              
              const secondPrice = prices.eq(2);
              console.log(prices.eq(1))
              const flexElements = secondPrice.find('.flex-1');
              const lastFlexElement = flexElements.last().text();
              console.log("Last Flex Element:", lastFlexElement);
            
              // Удалить все пробелы из строки
              const cleanedStr = lastFlexElement.replace(/\s+/g, '');
            
              const regexPrice = /^([\d.]+)(.*)$/;
            
              const matches = cleanedStr.match(regexPrice);
              console.log(matches[1]);
              if (matches) {
                const result = [(+matches[1] * 0.85).toFixed(3), matches[2]];
                console.log(result)
                if (option.length >= 3) {
                  option[2] = result; 
                } else {
                  option.push(result);
                }
                console.log("Updated Option:", option); 
                isModified = true; // Установить флаг изменений
              } else {
                console.log('No match found');
              }
            } catch (error) {
              console.error('Error fetching or processing URL:', error);
            }
          }
        }
        if (isModified) {
          chapter.markModified('options'); // Пометить массив как модифицированный
          try {
            await chapter.save();
            console.log('Chapter saved:', chapter._id);
          } catch (error) {
            console.error('Error saving chapter:', error);
          }
        }
      }
    }
    return 'success';
  } catch(error) {
    console.log(error)
    return error.message;
  }

}
export default getPriceG2g;