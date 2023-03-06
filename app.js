const express = require("express");
const app = express();
const cors = require("cors");
const apiCoordenadas = require("./apiCoordenadas");
const apiOpenWeather = require("./apiOpenWeather");
const calcularVelocidade = require("./calcularVelocidade.js");
require("dotenv").config();

const geocodeApiKey = process.env.GEOCODE_API_KEY;
const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.listen(5001);

app.get("/", (request, response) => {

    return (

        response.send("Back-End Clima Tempo.")

    );

});

app.get('/coords/lat=:lat&lon=:lon', async (req, res) => {

    const { lat } = req.params;
    const { lon } = req.params;
    
    try {
    
        // const { data } = await apiCoordenadas.get(`${lat},${lon}?json=1&auth=${geocodeApiKey}`);
        const { data } = await apiCoordenadas.get(`${lat},${lon}?json=1`);

        return res.send({

            cidade: data.city,

         });
    
    } catch (error) {
    
        res.send({ error: error.message });
    
    };
});

app.get('/tempo/:cidade', async (req, res) => {

    const { cidade } = req.params;

    try {

        const { data } = await apiOpenWeather.get(`weather?q=${cidade}&lang=pt_br&units=metric&appid=${openWeatherApiKey}&mode=json`);

        return res.send({data});

    } catch (error) {

        res.send({ error: error.message });

    };

});

app.get('/buscar-dados-por-coordenadas/lat=:lat&lon=:lon', async (req, res) => {

    const { lat } = req.params;
    const { lon } = req.params;

    try {

        const coords = { data } = await apiCoordenadas.get(`${lat},${lon}?json=1`);
        // const coords = { data } = await apiCoordenadas.get(`${lat},${lon}?json=1&auth=${geocodeApiKey}`);

        const tempo = { data } = await apiOpenWeather.get(`weather?q=${coords.data.city}&lang=pt_br&units=metric&appid=${openWeatherApiKey}&mode=json`);

        const dadosBrutos = {

            coords: coords.data,
            tempo: tempo.data,

        };

        calcularVelocidade(tempo.data.wind.speed);

        const resultadoDaBusca = {

            cidade: coords.data.city,
            temperatura: tempo.data.main.temp.toFixed(),
            tempo: tempo.data.weather[0].description,
            vento: velocidadeDoventoEmKM.toFixed(),
            sensacaoTermica: tempo.data.main.feels_like.toFixed(),
            umidade: tempo.data.main.humidity

        }

        res.send({ resultadoDaBusca });
        // res.send({ resultadoDaBusca, dadosBrutos });

    } catch(error) {

        res.send({ error });

    };

});

app.get('/buscar-dados-por-cidade/:cidade', async(req, res) => {
    
    const { cidade } = req.params;

    try {

        const tempo = { data } = await apiOpenWeather.get(`weather?q=${cidade}&lang=pt_br&units=metric&appid=${openWeatherApiKey}&mode=json`);

        calcularVelocidade(tempo.data.wind.speed);

        const resultadoDaBusca = {
            cidade: tempo.data.name,
            temperatura: tempo.data.main.temp.toFixed(),
            tempo: tempo.data.weather[0].description,
            vento: velocidadeDoventoEmKM.toFixed(),
            sensacaoTermica: tempo.data.main.feels_like.toFixed(),
            umidade: tempo.data.main.humidity
        }

        res.send({resultadoDaBusca});


    } catch(error) {

        res.send({ error: error.message });

    };

});