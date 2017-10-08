# FAparser
Npm library for parse films info from Filmaffinity

## Getting Started
Install npm dependency

```
npm install faparser --save
```

## Usage

There are three methods which will response a promise with an object or an array of object

```
//Init
var faparser = require('faparser')
```

### faparser.film( object ) 

Return a promise with a film full data object (with images and films) or error if have one

```
faparser.film({ idfilm: 908768, lang: 'es''}).then(function(film){ 
    console.log(film) 
}).catch(function(e){ 
    console.log(e) 
})

```

### faparser.preview( object )

Return a promise with a film result data object (without images and films) or error if have one

```
faparser.preview({id: 632559, lang: 'es'}).then(function(result){
    console.log(result)
}).catch(function(e){
    console.log(e)
})
```

### faparser.search( object )

Return a promise with an array of result data object or error if have one

```
faparser.search({query:'spiderman',lang:'es',type: faparser.TITLE, start:0}).then(function(result){
    console.log(result)
}).catch(function(e){
    console.log(e)
})
```

## Extra
Each actor, director or genre contains a request object. This object can send to **faparser.search** for get results.

## Author
* Alberto Espinilla