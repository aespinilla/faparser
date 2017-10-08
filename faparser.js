var parser = require('./parser')
var requestfa = require('./requestfa')
var Promise = require('promise')

module.exports = {
    film: film,
    preview: preview,
    search: search,
    TITLE: 'TITLE',
    GENRE: 'GENRE',
    TOPIC: 'TOPIC',
    DIRECTOR: 'DIRECTOR',
    CAST: 'CAST'
}

function search(data){
    return new Promise(function(resolve, reject){
        var now = new Date()
        data.isFilm = false
        requestfa.FArequest(data).then(function(res){
            res.lang = data.lang
            res.type = data.type
            var result = parser.parseSearch(res)
            var diff = new Date().getTime() - now.getTime()
            console.log('Process time: '+diff+'ms succesfully for data: '+JSON.stringify(data)+' with result count: '+result.result.length)
            return resolve(result)
        }).catch(function(error){
            console.log(error)
            var diff = new Date().getTime() - now.getTime()
            console.log('Process time: '+diff+'ms for data: '+JSON.stringify(data)+' with error: '+error)
            return reject(error)
        })
    })
}

function preview(data){
    return new Promise(function(resolve, reject){
        var now = new Date()
        data.isFilm = true
        requestfa.FArequest(data).then(function(result){
            var film = parser.parseFilm(result)
            var filmResult = {
                id: data.id,
                url: film.url,
                thumbnail: film.imageUrlMed.replace("mmed", "msmall"),
                year: film.year,
                title: film.title,
                directors: film.directors,
                cast: film.cast,
                country: film.country,
                rating: data.lang == 'es' && film.rating?film.rating.replace('.',','):film.rating,
                votes: film.votes
            }
            var diff = new Date().getTime() - now.getTime()
            console.log('Process time: '+diff+'ms succesfully for preview data: '+JSON.stringify(data)+' with film title: '+film.title)
            return resolve(filmResult)
        }).catch(function(e){
            return reject(e)
        })
    })
}

function film(data){
    return new Promise(function (resolve, reject) {
        var now = new Date()
        data.isFilm = true
        filmTaskPromise(data).then(function(film){
            var diff = new Date().getTime() - now.getTime()
            console.log('Process time: '+diff+'ms succesfully for data: '+JSON.stringify(data)+' with film title: '+film.title)
            return resolve(film)
        }).catch(function(error){
            console.log(error)
            var diff = new Date().getTime() - now.getTime()
            console.log('Process time: '+diff+'ms for data: '+JSON.stringify(data)+' with error: '+error)
            return reject(error)
        })
    })
}

function filmTaskPromise(data){
    return new Promise(function(resolve, reject){
        var f  = data
        var t = clone(data)
        t.isFilm = false
        t.type = 'TRAILERS'
        var i = clone(data)
        i.isFilm = false
        i.type = 'IMAGES'

        Promise.all([requestfa.FArequest(f), requestfa.FArequest(i), requestfa.FArequest(t)])
            .then(function(result){
                var film = parser.parseFilm(result[0])
                film.id = data.id
                film.images = parser.parseImages(result[1])
                film.trailers = parser.parseTrailers(result[2])
                return resolve(film)
            }).catch(function(error){
                return reject(error)
            })
    })
}

function clone(o){
    return JSON.parse(JSON.stringify(o))
}