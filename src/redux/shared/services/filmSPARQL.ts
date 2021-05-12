import { map } from "rxjs/internal/operators/map";
import { catchError } from "rxjs/internal/operators/catchError";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { randomIntFromInterval } from './utilitySPARQL';
import { concatMap } from "rxjs/operators";

// get film info need OMDB as Wikidata does not provide film image
// we thus get IMDB code form Wikidata then  get image on IMDB 
export interface Article {
    label: string;
    image: string;
}
// on DBPedia get IMDB code list of movies that has countryCode as country origin
const getFilmfromCountryOrigin = (countryCode:string)  => {
  const proxyurl = "https://quiz-magnet.herokuapp.com/";
  
  const query = `SELECT distinct ?imdb WHERE{
  wd:${countryCode} wdt:P37 ?officialLanguage.
  ?film wdt:P31 wd:Q11424.
  ?film wdt:P1476 ?title.
  ?film wdt:P495 wd:${countryCode}.
  ?film wdt:P495 ?country.
  ?film wdt:P577 ?releaseDate.
  ?film wdt:P1258 ?rottenTomatoes.
  ?film wdt:P345 ?imdb.
  ?film wdt:P136 ?genre.
  FILTER ( ?genre != wd:Q93204)        
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}}
  GROUP BY ?film ?title ?officialLanguage ?releaseDate ?imdb
  HAVING (COUNT(distinct ?country) < 2)
  ORDER BY DESC(?releaseDate)
  LIMIT 50`

  const  request$ = ajax(
    {
        url: proxyurl + 'https://query.wikidata.org/sparql', 
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    }
  ).pipe(
    map((response:any) => {
      if(response.response.results.bindings.length === 0) {
        return '';
      }
        console.log('response: ', response.response.results.bindings)
        return response.response.results.bindings[randomIntFromInterval(0,response.response.results.bindings.length-1)].imdb.value;
    
    }),
    catchError(error => {
      console.log('error: ', error);
      return of(error);
    })
  )
return request$;
}

// get IMDB code from WikiData film id, we'll then be able to query OMDB (which is open source IMDB)
// need to go through OMDB as Wikidata does not provide film image
const getImdbFromWD = (filmWD: string) => {

    const proxyurl = "https://quiz-magnet.herokuapp.com/";
    const queryIMDB = `
    select ?imdb 
where {
  wd:${filmWD} wdt:P345 ?imdb.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
    `
    const  request$ = ajax(
        {
            url: proxyurl + 'https://query.wikidata.org/sparql', 
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-query',
                'Accept': 'application/sparql-results+json'
            },
            body: queryIMDB
        }
      ).pipe(
        map((response:any) => {
            console.log('response: ', response.response.results.bindings)
            return response.response.results.bindings[0].imdb.value;
        
        }),
        catchError(error => {
          console.log('error: ', error);
          return of(error);
        })
      )
    return request$;
  }

  ////////// query opensource IMDB on specific movie, we need image and title label
  const getFilmFromImdb = (imdbCode: string) => {
    console.log('getFilmFromImdb', imdbCode);
    const queryOMDB = `https://www.omdbapi.com/?i=${imdbCode}&plot=short&apikey=134fdd52`;
    const request$ = ajax(queryOMDB)
    .pipe(
       map((response:any) => {
           console.log('OMDB response: ', response);
           return {
               label: response.response.Title,
               image: response.response.Poster,
           }      
       }),      

    catchError(error => {
        console.log('error: ', error);
        return of(error);
    })
       );
    return request$;
  }

  

// 1 - with country code, on WikiData, get IMDB code of a movie having country lanaguage and origin  
// 2 - with IMDB code, on OMDB, get the film image and title
  const getSparqlFilmChoice = (topic:string, codeWD: string) => {
  
 
    const request$ = getFilmfromCountryOrigin(codeWD)
    .pipe(
       map(codeIMDB => {
           console.log('getSparqlFilmChoice response: ', codeIMDB);
           return codeIMDB;
       
       }),
  
   concatMap((codeIMDB:string) => {
    console.log('Pipe getFilmFromImdb',codeIMDB);
    if(codeIMDB === '') {
      return of({ 
        film: '',
        label: '',
        })
    }
    return getFilmFromImdb(codeIMDB);
}),
    map((filmChoice: Article)=> {
        console.log('filmChoice', filmChoice);
        return filmChoice
    }),
  
    catchError(error => {
        console.log('error: ', error);
        return of(error);
    })
       );
    return request$;
  }
  

  export {
    getImdbFromWD,
    getFilmFromImdb,
    getSparqlFilmChoice,
  }