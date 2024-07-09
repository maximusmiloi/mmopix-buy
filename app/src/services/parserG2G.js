import cheerio from 'cheerio';
import Chaptersgold from '../models/chaptergold.js';

const getPriceG2g = async(link) => {
  try {
    const chapters = await Chaptersgold.find();

    for (const chapter of chapters) {
      if (chapter.options.length > 0) {
        let isModified = false; // Флаг для отслеживания изменений
        for (const option of chapter.options) {
          const regex = /g2g\.com/;
          if (regex.test(option[1])) {
            const fetchOptions = {
              method: 'GET',
              Cookie: 'CreateListing[currency]=USD;'
            };
            try {
              console.log(option[1][0])
              link = option[1][0].trim();
              const requestG2GPrice = await fetch(link, fetchOptions);
              const responseG2GPrice = await requestG2GPrice.text();
              
              const $ = cheerio.load(responseG2GPrice);
              
              const priceContainer = $(`.other-seller-offeer_mainbox`);
              const prices = priceContainer.find('.other_offer-desk-main-box');
              
              const secondPrice = prices.eq(2);
              const flexElements = secondPrice.find('.flex-1');
              const lastFlexElement = flexElements.last().text();
              console.log("Last Flex Element:", lastFlexElement);
            
              // Удалить все пробелы из строки
              const cleanedStr = lastFlexElement.replace(/\s+/g, '');
            
              const regexPrice = /^([\d.]+)(.*)$/;
            
              const matches = cleanedStr.match(regexPrice);
            
              if (matches) {
                const result = [matches[1], matches[2]];
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