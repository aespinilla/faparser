var parser = require('./parser')
var requestfa = require('./requestfa')
var Promise = require('promise')

module.exports = {
    film: film,
    search: search,
    TITLE: 'TITLE',
    GENRE: 'GENRE',
    TOPIC: 'TOPIC',
    DIRECTOR: 'DIRECTOR',
    CAST: 'CAST'
}

function search(data, callback){
    var now = new Date()
    data.isFilm = false

    requestfa.FArequest(data).then(function(res){
        res.lang = data.lang
        res.type = data.type
        var result = parser.parseSearch(res)
        var diff = new Date().getTime() - now.getTime()
        console.log('Process time: '+diff+'ms succesfully for data: '+JSON.stringify(data)+' with result count: '+result.result.length)
        return callback(null, result)
    }).catch(function(error){
        console.log(error)
        var diff = new Date().getTime() - now.getTime()
        console.log('Process time: '+diff+'ms for data: '+JSON.stringify(data)+' with error: '+error)
        return callback(error, [])
    })
}

function film(data, callback){
    var now = new Date()
    data.isFilm = true
    filmTaskPromise(data).then(function(film){
        var diff = new Date().getTime() - now.getTime()
        console.log('Process time: '+diff+'ms succesfully for data: '+JSON.stringify(data)+' with film title: '+film.title)
        callback(null, film)
    }).catch(function(error){
        console.log(error)
        var diff = new Date().getTime() - now.getTime()
        console.log('Process time: '+diff+'ms for data: '+JSON.stringify(data)+' with error: '+error)
        callback(error, null)
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
                var film = {}
                for (var i in result){
                    var el = result[i]
                    if (el.isFilm == true){
                        film = parser.parseFilm(el)
                        film.id = data.idfilm
                    }
                    if(el.type == 'IMAGES'){
                        film.images = parser.parseImages(el)
                    }
                    if(el.type == 'TRAILERS'){
                        film.trailers = parser.parseTrailers(el)
                    }
                }
                resolve(film)
            }).catch(function(error){
                reject(error)
            })
    })
}

function clone(o){
    return JSON.parse(JSON.stringify(o))
}