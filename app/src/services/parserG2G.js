import cheerio from 'cheerio';
import Chaptersgold from '../models/chaptergold.js';
import axios from 'axios';
import { Readable, Transform, pipeline } from 'stream';
import { promisify } from 'util';
import pLimit from 'p-limit';

const pipelineAsync = promisify(pipeline);
const limit = pLimit(5); // Ограничение до 5 одновременных запросов

const fetchAndProcessPage = async (link, cookies1) => {
  const fetchOptions = {
    headers: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': cookies1
    },
    responseType: 'text',
    method: 'GET',
  };

  try {
    const responseG2GPrice = await axios.get(`${link}&sort=lowest_price`, fetchOptions);

    {
      const $ = cheerio.load(responseG2GPrice.data);
      const priceContainer = $('.other-seller-offeer_mainbox');
      const prices = priceContainer.find('.other_offer-desk-main-box');
      const secondPrice = prices.eq(2);
      const flexElements = secondPrice.find('.flex-1');
      const lastFlexElement = flexElements.last().text().replace(/\s+/g, '');

      const regexPrice = /^([\d.]+)(.*)$/;
      const matches = lastFlexElement.match(regexPrice);

      if (matches) {
        const result = [(+matches[1] * 0.85).toFixed(3), matches[2]];
        console.log(result)
        return result;
      } else {
        console.log('No match found');
        return null;
      }
    }
  } catch (error) {
    console.error('Error fetching or processing URL:', error);
    return null;
  }
};

const processChapter = async (chapter, cookies1) => {
  let isModified = false;

  for (const option of chapter.options) {
    const regex = /g2g\.com/;
    if (regex.test(option[1])) {
      const link = option[1][0].trim();
      const result = await fetchAndProcessPage(link, cookies1);

      if (result) {
        if (option.length >= 3) {
          option[2] = result;
        } else {
          option.push(result);
        }
        isModified = true;
      }
    }
  }

  if (isModified) {
    chapter.markModified('options');
    try {
      await chapter.save();
      console.log('Chapter saved:', chapter._id);
    } catch (error) {
      console.error('Error saving chapter:', error);
    }
  }
};

const getPriceG2g = async () => {
  try {
    const chapters = await Chaptersgold.find();
    const cookies1 = 'g2g_regional=%7B%22country%22%3A%22US%22%2C%22currency%22%3A%22USD%22%2C%22language%22%3A%22en%22%7D;';

    await pipelineAsync(
      Readable.from(chapters),
      new Transform({
        objectMode: true,
        async transform(chapter, encoding, callback) {
          await limit(() => processChapter(chapter, cookies1));
          callback();
        }
      })
    );

    return 'success';
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export default getPriceG2g;