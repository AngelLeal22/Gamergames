const gameRouter = require("express").Router();
const axios = require('axios');


gameRouter.get('/', async (req, res) => {

    const apiUrl = 'https://www.freetogame.com/api/games';

    try {
       
    // Axios - return only the response body (response.data)
    const { data } = await axios.get(apiUrl);

    console.log(data);
    return res.json(data);
    
    } catch (error) {
        console.error('Error fetching data from FreeToGame API:', error);
        res.status(500).json({ error: 'Failed to fetch data from the external API' });
    }
});


module.exports = gameRouter;