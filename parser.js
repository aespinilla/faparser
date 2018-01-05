/**
 * Created by aespinilla on 8/3/17.
 */
var jQuery = require('cheerio')
var url = require('url')

var exports = module.exports = {}

var BASE_URL = "http://www.filmaffinity.com"

exports.parseFilm = function(data){
    try {
        var content = jQuery(data.body)
        var film = {}
        film.url = data.url
        film.imageUrl = content.find('#movie-main-image-container').find('a').attr('href');
        var imageUrlMed = content.find('#movie-main-image-container').find('img').attr('src');
        if (imageUrlMed.includes('noimgfull')){
            imageUrlMed = BASE_URL+imageUrlMed
            film.imageUrl = imageUrlMed
        }
        film.imageUrlMed = imageUrlMed
        film.rating = content.find('#movie-rat-avg').attr('content');
        film.votes = content.find('#movie-count-rat').find('span').attr('content')
        film.title = content.find('#main-title').find('span').text();
        content.find('.movie-info dt').each(function (index, a) {
            var bind = jQuery(a).text().trim().toLowerCase();
            switch (bind) {
                case "original title":
                case "título original":{
                    var element = jQuery(a)
                    var tO = element.next().text().trim()
                    film.titleOrig = tO
                    var akas = []
                    content.find('dd.akas li').each(function(index, akatitle){
                        var ak = jQuery(akatitle).text()
                        akas.push(ak)
                    })
                    if (akas.length != 0){
                        film.akas = akas
                        film.titleOrig = tO.substring(0, tO.length-3).trim()
                    }
                    break
                }
                case "year":
                case "año":{
                    film.year = jQuery(a).next().text().trim()
                    break
                }
                case "running time":
                case "duración":{
                    film.running = jQuery(a).next().text().trim()
                    break
                }
                case "country":
                case "país":{
                    film.country = {
                        imgCountry: BASE_URL + jQuery(a).next().find('img').attr('src'),
                        country: jQuery(a).next().find('img').attr('title'),
                    }
                    break
                }
                case "director":
                case "dirección":{
                    film.directors = []
                    jQuery(a).next().find('a').each(function (index2, directors) {
                        film.directors.push({
                            name: jQuery(directors).find('span').text().trim(),
                            request: {
                                query: jQuery(directors).find('span').text().trim(),
                                type: 'DIRECTOR',
                                lang: data.lang
                            }
                        })
                    })
                    break
                }
                case "screenwriter":
                case "guión":{
                    film.screenwriter = []
                    jQuery(a).next().find('.nb span').each(function (index2, guion) {
                        film.screenwriter.push(jQuery(guion).text().trim())
                    })
                    break
                }
                case "music":
                case "música":{
                    film.music = [];
                    jQuery(a).next().find('.nb span').each(function (index3, music) {
                        film.music.push(jQuery(music).text().trim())
                    })
                    break
                }
                case "cinematography":
                case "fotografía":{
                    film.cinematography = [];
                    jQuery(a).next().find('.nb span').each(function (index3, foto) {
                        film.cinematography.push(jQuery(foto).text().trim())
                    })
                    break
                }
                case "cast":
                case "reparto":{
                    film.cast = [];
                    jQuery(a).next().find('a').find('span').each(function (index3, actor) {
                        film.cast.push({
                            name: jQuery(actor).text().trim(),
                            request: {
                                query: jQuery(actor).text().trim(),
                                type: 'CAST',
                                lang: data.lang
                            }
                        })
                    })
                    break
                }
                case "producer":
                case "productora":{
                    film.production = jQuery(a).next().find('.nb span').text().trim()
                    break
                }
                case "genre":
                case "género":{
                    film.genre = []
                    jQuery(a).next().find('a').each(function (index3, genero) {
                        var link = jQuery(genero).attr('href')
                        var g = jQuery(genero).text().trim()
                        var gnr = url.parse(link, true).query.genre
                        if (!gnr){
                            gnr = url.parse(link, true).query.topic
                        }
                        film.genre.push({
                            name: g,
                            request: {
                                query: gnr,
                                type: link.includes('moviegenre.php') ? 'GENRE' : (link.includes('movietopic.php') ? 'TOPIC' : 'TITLE'),
                                lang: data.lang
                            }
                        })
                    })
                    break
                }
                case "synopsis / plot":
                case "sinopsis":{
                    film.synopsis = jQuery(a).next().text().trim()
                    break
                }
                default:{
                    break
                }
            }
        })
        return film
    } catch (err) {
        console.log(err)
        throw ({code: 4, msg: 'Can not parse film'})
    }
    return {}
}

exports.parseSearch = function(data){
    var pathname = url.parse(data.response.request.uri.href).pathname;
    if (pathname.includes('film')) {
        var idtemp = pathname.substring(pathname.indexOf('film') + 'film'.length, pathname.indexOf('.'));
        //console.log(pathname)
        data.response.lang = data.lang
        var film  = exports.parseFilm(data.response)
        return {
            more: false,
            count: 1,
            result: [{
                id: idtemp,
                url: data.response.request.uri.href,
                thumbnail: film.imageUrlMed.replace("mmed", "msmall"),
                year: film.year,
                title: film.title,
                directors: film.directors,
                cast: film.cast,
                country: film.country,
                rating: data.lang == 'es' && film.rating?film.rating.replace('.',','):film.rating,
                votes: film.votes
            }]
        }
    }

    if (data.type === 'TOPIC' || data.type === 'GENRE'){
        var sfilms = parseSpecialSearch({container: jQuery(data.body).find('.title-movies'), lang: data.lang})
        return {
            more: false,
            count: sfilms.length,
            result: sfilms
        }
    }

    try {
        var outPut = {}
        var films = []
        var content = jQuery(data.body)
        var year;
        content.find('.se-it').each(function (index, a) {
            var filmview = {};
            var relUrl = jQuery(a).find('.mc-title').find('a').attr('href');
            filmview.id = relUrl.substring(relUrl.indexOf('/film') + '/film'.length, relUrl.indexOf('.'));
            filmview.url = BASE_URL + relUrl;
            filmview.country = {
                imgCountry: BASE_URL+jQuery(a).find('.mc-title').find('img').attr('src'),
                country: jQuery(a).find('.mc-title').find('img').attr('title')
            }
            if (jQuery(a).hasClass('mt')) {
                year = jQuery(a).find('.ye-w').text();
            }
            filmview.year = year;
            var thumbnail = jQuery(a).find('.mc-poster').find('img').attr('src');
            if (thumbnail.includes('noimgfull')){
                thumbnail = BASE_URL+thumbnail
            }
            filmview.thumbnail = thumbnail
            filmview.title = jQuery(a).find('.mc-title').find('a').attr('title');
            filmview.directors = [];
            jQuery(a).find('.mc-director').find('.credits').find('a').each(function (index, b) {
                filmview.directors.push({
                    name: jQuery(b).attr('title'),
                    request: {
                        query: jQuery(b).attr('title'),
                        type: 'DIRECTOR',
                        lang: data.lang
                    }
                })

            })
            filmview.cast = [];
            jQuery(a).find('.mc-cast').find('.credits').find('a').each(function (index, d) {
                filmview.cast.push({
                    name: jQuery(d).attr('title'),
                    request: {
                        query: jQuery(d).attr('title'),
                        type: 'CAST',
                        lang: data.lang
                    }
                })

            })
            filmview.rating = jQuery(a).find('.avgrat-box').text()
            filmview.votes = jQuery(a).find('.ratcount-box').text()
            films.push(filmview);
        })
        if (content.find('.see-all-button').length){
            outPut.more = true
        }else{
            outPut.more = false
        }
        outPut.count =  films.length
        outPut.result = films
        return outPut
    } catch (err) {
        console.log(err)
    }
    return []
}

exports.parseTrailers = function(data){
    try {
        var content = jQuery(data.body)
        var trailers = []
        content.find('iframe').each(function (index, data) {
            var urlt = jQuery(data).attr('src')
            //console.log(urlt);
            trailers.push(urlt);
        })
        return trailers
    } catch (err) {
        console.log(err)
        throw ({code: 4, msg: 'Can not parse film'})
    }
    return []
}

exports.parseImages = function(data){
    var items = []
    jQuery(data.body).find('#main-image-wrapper').find('a').each(function(index, item){
        var href = jQuery(item).attr('href')
        if (href.indexOf('.jpg') != -1){
            var item = {
                large:href
            }
            if (href.indexOf('large') != -1) {
                item.thumbnail = href.replace("large","s200")
            }else{
                item.thumbnail = href
            }
            items.push(item)
        }
    })
    return items
}

function parseSpecialSearch(data){
    try {
        var films = []
        data.container.find('.record').each(function (index, element) {
            var elHtml = jQuery(element)
            var f = {}
            f.id = elHtml.find('.movie-card').attr('data-movie-id')
            f.thumbnail = elHtml.find('.mc-poster img').attr('src')
            var titleHtml = elHtml.find('.mc-title')
            f.url = BASE_URL+elHtml.find('a').attr('href')
            f.title = titleHtml.find('a').attr('title')
            f.country = {
                imgCountry: BASE_URL+titleHtml.find('img').attr('src'),
                country: titleHtml.find('img').attr('title')
            }
            f.year = titleHtml.text().substring(f.title.length+2).replace(")", "").trim()
            f.directors = []
            elHtml.find('.mc-director .credits a').each(function(index, elDir){
                var item = jQuery(elDir)
                f.directors.push({
                    name: item.attr('title'),
                    request: {
                        query: item.attr('title'),
                        type: 'DIRECTOR',
                        lang: data.lang
                    }
                })

            })
            f.cast = []
            elHtml.find('.mc-cast .credits a').each(function(index, elCast){
                var item = jQuery(elCast)
                f.cast.push({
                    name: item.attr('title'),
                    request: {
                        query: item.attr('title'),
                        type: 'CAST',
                        lang: data.lang
                    }
                })
            })
            f.rating = elHtml.find('.avg-w').text().trim()
            f.votes = elHtml.find('.votes2').text().trim()
            //console.log(f)
            films.push(f)
        })
        return films
    }catch (err){
        console.log(err)
    }
    return []
}
