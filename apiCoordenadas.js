const axios = require("axios");

const apiCoordenadas = axios.create({
    baseURL: 'https://geocode.xyz/'
});

module.exports = apiCoordenadas;