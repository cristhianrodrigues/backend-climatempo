const axios = require("axios");

const apiOpenWeather = axios.create({
    baseURL:'https://api.openweathermap.org/data/2.5/'
});

module.exports = apiOpenWeather;