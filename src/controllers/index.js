const cheerio = require('cheerio')
const services = require('../helpers/services')
const url = require('../data/index')

const fetchAllMovies = async (req, res, response) => {
    try {
        const $ = cheerio.load(response.data);
        const element = $("#movies");
        const pagination = $("#pagination");

        let key, title, img, rating, year;
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
                rating = $(e)
                    .find(".desc span:nth-child(1)")
                    .text()
                    .replace(/\s\s+/g, "");
                year = $(e)
                    .find(".desc span:nth-child(2)")
                    .text()
                    .replace(/\s\s+/g, "");

                movies_list.push({ key, title, img, rating, year });
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

const fetchMovie = async (req, res, response) => {
    try {
        const $ = cheerio.load(response.data);
        const element = $("#main-content");
        let image_jumbotron, image_thumbnail, title, tagline, year, country, duration, director, score, description, link_trailer
        let casts = []
        let genres = []

        if (element.find('.info_movie').length == 1) {
            image_jumbotron = element.find('.tpost img').attr('src')
            image_jumbotron = image_jumbotron.replace('w300', 'w1280')

            image_thumbnail = element.find('.info_movie img.wp-post-image').attr('src')
            title = element.find('.info_movie .postdetail h1').text()
            tagline = element.find('.info_movie .postdetail .tagline').text()
            year = element.find('.info_movie .postdetail .thn div:first-child').text()
            country = element.find('.info_movie .postdetail .thn div:nth-child(2)').text()
            duration = element.find('.info_movie .postdetail .thn div:nth-child(3)').text()
            director = element.find('.info_movie .postdetail .info p:first-child a').text()
            score = element.find('.tpost .backdrop .absolute:first-child .inline-block').html()
            description = element.find('#tab-1 p').text()
            link_trailer = element.find('#tab-2 iframe').attr('src')
            element.find('.info_movie .postdetail .info p:nth-child(3) a').map((i, e) => {
               genres.push($(e).text())
            })
            element.find('#tab-3 .grid .relative').map((i, e) => {
                casts.push({
                    img: $(e).find('.muka img').attr('src'),
                    name: $(e).find('.profil h2').text(),
                    cast: $(e).find('.profil p').text()
                })
            })
            
            movie = {image_jumbotron, image_thumbnail, title, tagline, year, country, duration, director, score, genres, description, link_trailer, casts}
            res.send({
                method: req.method,
                status: true,
                results: movie,
            });
        } else {
            res.send({
                method: req.method,
                status: false,
                message:
                    "Sorry, The movie you are looking for doesn't exist :(",
            });
        }

    } catch(error) {
        throw error
    }
}

const Controller = {
    getMovies: async (req, res) => {
        const response = await services.fetchService(
            `${url}category/movies/`,
            res
        );

        return fetchAllMovies(req, res, response);
    },
    getSeries: async (req, res) => {
        const response = await services.fetchService(
            `${url}category/series/`,
            res
        );
        return fetchAllMovies(req, res, response);
    },
    getMoviesBypage: async (req, res) => {
        const page = req.params.page;
        const response = await services.fetchService(
            `${url}category/movies/page/${page}`,
            res
        );

        return fetchAllMovies(req, res, response);
    },
    getSeriesBypage: async (req, res) => {
        const page = req.params.page;
        const response = await services.fetchService(
            `${url}category/series/page/${page}`,
            res
        );

        return fetchAllMovies(req, res, response);
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

        return fetchAllMovies(req, res, response);
    },
    detailMovie: async (req, res) => {
        const key = req.params.key;

        const response = await services.fetchService(
            `${url}${key}`,
            res
        );

        return fetchMovie(req, res, response)
    }
};

module.exports = Controller