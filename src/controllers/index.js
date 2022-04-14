const cheerio = require('cheerio')
const services = require('../helpers/services')
const url = require('../data/index')

const fetchMovies = async (req, res, response) => {
    try {
        const $ = cheerio.load(response.data);
        const element = $("#movies");
        const pagination = $("#pagination");

        let key, title, img, quality, rating, year;
        let movies_list = [];

        let page =
            pagination.text().replace(/\s\s+/g, "") != ""
                ? $("#pagination .pages").text()
                : "Page 1 of 1";

        if (element.find(".content").length != 0) {
            element.find(".content").each((i, e) => {
                key = $(e).find("a").attr("href").split("/")[3];
                title = $(e).find(".title h2").text();
                img = $(e).find(".poster img").attr("src");
                quality = $(e)
                    .find(".thumbnail div:first-child")
                    .text()
                    .replace(/\s\s+/g, "");
                rating = $(e)
                    .find(".desc span:nth-child(1)")
                    .text()
                    .replace(/\s\s+/g, "");
                year = $(e)
                    .find(".desc span:nth-child(2)")
                    .text()
                    .replace(/\s\s+/g, "");

                movies_list.push({ key, title, img, quality, rating, year });
            });
            res.send({
                method: req.method,
                status: true,
                page: page,
                results: movies_list,
            });
        } else {
            res.send({
                method: req.method,
                status: false,
                message:
                    "Sorry, The movie you are looking for doesn't exist :(",
            });
        }
    } catch (err) {
        throw err;
    }
};

const Controller = {
    getMovies: async (req, res) => {
        const response = await services.fetchService(
            `${url}category/movies/`,
            res
        );

        return fetchMovies(req, res, response);
    },
    getSeries: async (req, res) => {
        const response = await services.fetchService(
            `${url}category/series/`,
            res
        );
        return fetchMovies(req, res, response);
    },
    getMoviesBypage: async (req, res) => {
        const page = req.params.page;
        const response = await services.fetchService(
            `${url}category/movies/page/${page}`,
            res
        );

        return fetchMovies(req, res, response);
    },
    getSeriesBypage: async (req, res) => {
        const page = req.params.page;
        const response = await services.fetchService(
            `${url}category/series/page/${page}`,
            res
        );

        return fetchMovies(req, res, response);
    },
    searchMovies: async (req, res) => {
        const key = req.query.key;
        const page = req.query.page ? req.query.page : 1;

        if (!key) {
            return res.send({
                "how to use": {
                    key: "add '?key={your-keyword}' after url /search",
                    page: "if you want to see movies from other pages, add '?key={your-keyword}&page={page-number}' after url /search",
                },
            });
        }

        const response = await services.fetchService(
            `${url}page/${page}/?s=${key}&post_type=post`,
            res
        );

        return fetchMovies(req, res, response);
    },
};

module.exports = Controller