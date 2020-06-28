import { map } from "rxjs/internal/operators/map";
import { catchError } from "rxjs/internal/operators/catchError";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";

////
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

  //////////
  const getFilmFromImdb = (imdbCode: string) => {
    console.log('getFilmFromImdb', imdbCode);
    const queryOMDB = `https://www.omdbapi.com/?i=tt0120102&plot=short&apikey=134fdd52`;
    const request$ = ajax(queryOMDB)
    .pipe(
       map(response => {
           console.log('OMDB response: ', response);
           return response.response.results.bindings[0].code.value;       
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
  }