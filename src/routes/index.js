const express = require('express')
const route = express.Router()
const url = require('../data/index')

const Controller = require('../controllers/index')

route.get("/", (req, res) => {
    res.send({
        title: "movies-api",
        "source of": `${url}`
    });
});

route.get("/movies", Controller.getMovies);
route.get("/series", Controller.getSeries);
route.get("/movies/:page", Controller.getMoviesBypage);
route.get("/series/:page", Controller.getSeriesBypage);
route.get("/search", Controller.searchMovies);

module.exports = route