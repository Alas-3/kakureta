// pages/api/scrape.js
import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    const url = 'https://gojo.wtf';  // Replace with the URL for Gojo.wtf's top anime page
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        const topAnime = [];

        $('.anif-block-ul li').each((index, element) => {
            const title = $(element).find('.film-name a').text().trim();
            const image = $(element).find('.film-poster-img').attr('src');
            const link = $(element).find('.film-name a').attr('href');
            const episodeCount = $(element).find('.tick-item.tick-eps').text().trim();

            topAnime.push({
                title,
                image,
                link,
                episodeCount,
            });
        });

        // Send the scraped data as a response
        res.status(200).json(topAnime);
    } catch (error) {
        console.error('Error fetching top anime:', error);
        res.status(500).json({ message: 'Error fetching top anime' });
    }
}
