import { map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";
//import { getFilmFromImdb, getImdbFromWD} from './filmSPARQL'

export interface Article {
    label: string;
    image: string;
}


////////////////
const FilmByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
SELECT DISTINCT ?film ?filmLabel ?subjectCount as ?Popularity (COUNT(distinct ?filmDirectors) as ?dirCount) WHERE {
  ?film <http://www.w3.org/2000/01/rdf-schema#label> ?filmLabel.
  ?film <http://dbpedia.org/ontology/director> ?filmDirectors.
  FILTER (LANG(?filmLabel) = "en")
  {
  SELECT ?film ?countryLabel  (COUNT(distinct ?subject) as ?subjectCount) WHERE {
  ?director <http://dbpedia.org/ontology/birthPlace> ?place.
  ?place <http://dbpedia.org/ontology/country> ?country.
  ?country <http://www.w3.org/2000/01/rdf-schema#label> ?countryLabel.
  ?country owl:sameAs <http://www.wikidata.org/entity/Q142>.
  ?film <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Film>.
  ?film <http://dbpedia.org/ontology/director> ?director.
  ?director <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Director>.
  ?film <http://dbpedia.org/property/country> ?countryFilmLabel.
  ?film <http://purl.org/dc/terms/subject> ?subject
  }
  GROUP BY ?film ?countryLabel 
  HAVING (COUNT(distinct ?subject) > 0)
  ORDER BY DESC(?subjectCount)
  LIMIT 500  
  }  
  }
  GROUP BY ?film ?filmLabel ?subjectCount
  HAVING (COUNT(distinct ?filmDirectors) = 1)
  ORDER BY DESC(?subjectCount)
  LIMIT 500 &format=json`;

const musicianByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
    ?musician rdfs:label ?label.
    ?musician <http://dbpedia.org/ontology/birthPlace> ?place.
    ?place <http://dbpedia.org/ontology/country> ?country.
    ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
    ?musician <http://purl.org/dc/terms/subject> ?subject.
    ?musician <http://dbpedia.org/ontology/thumbnail> ?image.
    ?musician <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Musician>.
    FILTER (LANG(?label) = "en")
    }
    GROUP BY ?musician ?image ?label
    HAVING (COUNT(distinct ?subject) >= 0)
    ORDER BY DESC(?count)
    LIMIT 20 &format=json`;

const personByRegionQuery = (code:string)  => `https://dbpedia.org/sparql?query=
  PREFIX owl:<http://www.w3.org/2002/07/owl%23>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
  SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
    ?people <http://dbpedia.org/ontology/birthPlace> ?region.
    ?region owl:sameAs <http://www.wikidata.org/entity/${code}>.
    ?people <http://purl.org/dc/terms/subject> ?subject.
    ?people <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:Living_people>.
    ?people <http://dbpedia.org/ontology/thumbnail> ?image.
    ?people rdfs:label ?label.
    FILTER (LANG(?label) = "en")
    }
    GROUP BY ?label ?image
    HAVING (COUNT(distinct ?subject) > 1)
    ORDER BY DESC(?count)
    LIMIT 50
     &format=json`;

  const queryMap:any = {
    'personByRegion':personByRegionQuery,
    'musicianByCountry':musicianByCountryQuery,
  };

const getSparqlChoice = (theme:string, codeWD: string) => {
  
 
  const request$ = ajax(encodeURI(queryMap[theme](codeWD)).replace(/%2523/g,'%23'))
  .pipe(
     map(response => {
         console.log('getSparqlChoice response: ', response);
         return response.response.results.bindings;
     
     }),
     map((results:any[]) => {
        if(results.length === 0) {
          return {label:'', image:''};
        } 
      const fullList: Article[] = results.map( (el:any) => { 
          return { 
             label: el.label.value,
             image: el.image.value,
             }
         })
     //const index = fullList.findIndex(el => el.code === regionWD);
     return fullList[randomIntFromInterval(0,fullList.length-1)];
 
      
 }),      

  catchError(error => {
      console.log('error: ', error);
      return of(error);
  })
     );
  return request$;
}
////////////////

  function randomIntFromInterval(min:number, max:number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  export {
    getSparqlChoice,
  };