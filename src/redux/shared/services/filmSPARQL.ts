import { map } from "rxjs/internal/operators/map";
import { catchError } from "rxjs/internal/operators/catchError";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { randomIntFromInterval, getWDfromDBP } from './utilitySPARQL';
import { concatMap } from "rxjs/operators";

////
export interface Article {
    label: string;
    image: string;
}

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

  ////////
  const FilmByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
SELECT DISTINCT ?film ?filmLabel ?subjectCount as ?Popularity (COUNT(distinct ?filmDirectors) as ?dirCount) WHERE {
  ?film <http://www.w3.org/2000/01/rdf-schema%23label> ?filmLabel.
  ?film <http://dbpedia.org/ontology/director> ?filmDirectors.
  FILTER (LANG(?filmLabel) = "en")
  {
  SELECT ?film ?countryLabel  (COUNT(distinct ?subject) as ?subjectCount) WHERE {
  ?director <http://dbpedia.org/ontology/birthPlace> ?place.
  ?place <http://dbpedia.org/ontology/country> ?country.
  ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
  ?film <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Film>.
  ?film <http://dbpedia.org/ontology/director> ?director.
  ?director <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Director>.
  ?film <http://purl.org/dc/terms/subject> ?subject
  }
  GROUP BY ?film ?countryLabel 
  HAVING (COUNT(distinct ?subject) > 0)
  ORDER BY DESC(?subjectCount)
  LIMIT 50
  }  
  }
  GROUP BY ?film ?filmLabel ?subjectCount
  HAVING (COUNT(distinct ?filmDirectors) = 1)
  ORDER BY DESC(?subjectCount)
  LIMIT 10 &format=json`;

  /////////
  const getSparqlFilmChoice = (theme:string, codeWD: string) => {
  
 
    const request$ = ajax(encodeURI(FilmByCountryQuery(codeWD)).replace(/%2523/g,'%23'))
    .pipe(
       map(response => {
           console.log('getSparqlFilmChoice response: ', response);
           return response.response.results.bindings;
       
       }),
       concatMap((results:any[]) => {

        const fullList:any[] = results.map( (el:any) => { 
            return { 
               film: el.film.value,
               label: el.filmLabel.value,
               }
           })
       //const index = fullList.findIndex(el => el.code === regionWD);
       return getWDfromDBP(fullList[randomIntFromInterval(0,fullList.length-1)].film);
   
        
   }),
   concatMap((codeWD:string) => {
       console.log('Pipe getImdbFromWD',codeWD)
       return getImdbFromWD(codeWD);
   }),
   concatMap((codeIMDB:string) => {
    console.log('Pipe getFilmFromImdb',codeIMDB);
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
  ////////

  

  export {
    getImdbFromWD,
    getFilmFromImdb,
    getSparqlFilmChoice,
  }