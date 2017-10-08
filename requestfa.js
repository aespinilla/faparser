/**
 * Created by aespinilla on 20/6/17.
 */
var request = require('request')
var jQuery = require('cheerio')
var Promise = require('promise')

module.exports = {
    FArequest: rPromise
}

var BASE_URL = "http://www.filmaffinity.com"

var searchTypes =  {
    TITLE : "title",
        CAST : "cast",
        DIRECTOR : "director",
        GENRE : "/moviegenre.php?genre=",
        TOPIC : "/movietopic.php?topic=",
        IMAGES : "/filmimages.php?movie_id=",
        TRAILERS : "/evideos.php?movie_id="
}

function rPromise(data){
    return new Promise(function(resolve, reject){
        var url = computedUrl(data)
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var e = hasError(body)
                if (e.error == true) {
                    reject({
                            code: 1,
                            msg: e.msg
                        },
                        {
                            url:url,
                            response: response
                        })
                }else {
                    resolve({
                        url: url,
                        response: response,
                        type: data.type,
                        isFilm: data.isFilm,
                        lang: data.lang,
                        body: body
                    })
                }
            }else{
                reject({
                    code: 10,
                    msg: 'Could not connect url: '+url
                }, {
                    url:url
                })
            }
        })
    })
}

function hasError(body){
    if (jQuery(body).find('h1').text() === 'Not Found') {
        return {
            error: true,
            msg: 'Not Found'
        }
    }
    if (body === 'No Movie') {
        return {
            error: true,
            msg: 'No Movie'
        }
    }

    return {
        error: false,
        msg: null
    }
}

function computedUrl(data) {
    if (data.isFilm == true){
        return BASE_URL + '/'+data.lang+'/film' + data.id + '.html'
    }
    var lang = data.lang ? data.lang : 'es'
    var type = data.type && (searchTypes.hasOwnProperty(data.type)) ? data.type : searchTypes.TITLE
    var query = data.query
    var start = data.start ? data.start : 0
    var computedUrl = BASE_URL+'/'+lang
    if (type === 'CAST' || type === 'DIRECTOR'){
        computedUrl = computedUrl+'/search.php?stype='+searchTypes[type]+'&sn'
        computedUrl = computedUrl+'&stext='+encodeURIComponent(query)+'&from='+start+'&orderby=year'
    }else if (type == 'GENRE' || type == 'TOPIC'){
        computedUrl = computedUrl+searchTypes[type]+query+'&attr=rat_count&nodoc'
    }else if (type === 'IMAGES' ||type === 'TRAILERS'){
        computedUrl = computedUrl+searchTypes[type]+data.id
    }else{
        computedUrl = computedUrl+'/search.php?stype='+searchTypes[type]
        computedUrl = computedUrl+'&stext='+encodeURIComponent(query)+'&from='+start+'&orderby=year'
    }
    console.log('COMPUTED URL: '+computedUrl)
    return computedUrl.toLowerCase()
}

