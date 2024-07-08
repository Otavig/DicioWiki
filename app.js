const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());

app.get('/search/:word', async (req, res) => {
    const apiUrl = `https://api.dicionario-aberto.net/word/${req.params.word}`;

    try {
        const apiResponse = await axios.get(apiUrl);
        const json = apiResponse.data;
        res.json(json);
    } catch (error) {
        res.status(500).json({ error: 'Erro na requisição à API externa.' });
    }
});

app.get('/random', async (req, res) => {
    const randomApiUrl = 'https://api.dicionario-aberto.net/random';

    try {
        const randomApiResponse = await axios.get(randomApiUrl);
        const randomWord = randomApiResponse.data.word;
        res.json({ word: randomWord });
    } catch (error) {
        res.status(500).json({ error: 'Erro na requisição à API externa.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
