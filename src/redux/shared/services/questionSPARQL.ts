import { map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";
//import { getFilmFromImdb, getImdbFromWD} from './filmSPARQL'
import { randomIntFromInterval } from './utilitySPARQL';
import { QUERIES_MAP } from './../../constants'

export interface Article {
    label: string;
    image: string;
}

const locationQuery = (code:string)  => {
  console.log('placeQuery', code);
  return `https://dbpedia.org/sparql?query=
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
  SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
    ?place <http://dbpedia.org/ontology/thumbnail> ?image.    
        ?place owl:sameAs <http://www.wikidata.org/entity/${code}>.
        bind( "-"  as ?label)
        }
        LIMIT 1 &format=json`};
////////////////
const bandByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
  PREFIX owl: <http://www.w3.org/2002/07/owl%23>
  SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
    ?band rdfs:label ?label.
    ?band <http://dbpedia.org/ontology/hometown> ?place.
    ?place <http://dbpedia.org/ontology/country> ?country.
    ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
    ?band <http://purl.org/dc/terms/subject> ?subject.
    ?band <http://dbpedia.org/ontology/thumbnail> ?image.
    ?band <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Band>.
    FILTER (LANG(?label) = "en").
    }
    GROUP BY ?label ?image
    HAVING (COUNT(distinct ?subject) >= 0)
    ORDER BY DESC(?count)
    LIMIT 200 &format=json`;


const actorByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
  PREFIX owl: <http://www.w3.org/2002/07/owl%23>
  SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
    ?actor rdfs:label ?label.
 ?place <http://dbpedia.org/ontology/country> ?country.
 ?actor  <http://dbpedia.org/ontology/birthPlace> ?place.
 ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
   ?actor <http://purl.org/dc/terms/subject> ?subject.
   ?actor <http://dbpedia.org/ontology/thumbnail> ?image.
   ?actor <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Actor>.
 ?actor  <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:Living_people>.
 
 FILTER (LANG(?label) = "en").
   }
   GROUP BY ?label ?image
   HAVING (COUNT(distinct ?subject) >= 0)
   ORDER BY DESC(?count)
   LIMIT 50 &format=json`;

  const footballerByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
  PREFIX owl: <http://www.w3.org/2002/07/owl%23>
  SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
 
    ?player rdfs:label ?label.
  ?place <http://dbpedia.org/ontology/country> ?country.
  ?player  <http://dbpedia.org/ontology/birthPlace> ?place.
  ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
    ?player <http://purl.org/dc/terms/subject> ?subject.
    ?player <http://dbpedia.org/ontology/thumbnail> ?image.
    ?player <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Footballer>.
  ?player  <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:Living_people>.
  ?player <http://dbpedia.org/ontology/team> ?team.
  
  FILTER (LANG(?label) = "en").
    }
    GROUP BY ?label ?image
    HAVING (COUNT(distinct ?subject) >= 0)
    ORDER BY DESC(?count)
    LIMIT 5 &format=json`;


  const riverByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
PREFIX owl: <http://www.w3.org/2002/07/owl%23>
SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
  ?river <http://dbpedia.org/ontology/sourceCountry> ?country.
  ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
  ?river rdfs:label ?label.
  ?river <http://purl.org/dc/terms/subject> ?subject.
  ?river <http://dbpedia.org/ontology/thumbnail> ?image.
  ?river <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/River>.
FILTER (LANG(?label) = "en")
  }
  GROUP BY ?label ?image
  HAVING (COUNT(distinct ?subject) >= 0)
  ORDER BY DESC(?count)
  LIMIT 10 &format=json`;

  const dishByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23>
  PREFIX owl: <http://www.w3.org/2002/07/owl%23>
  SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
    ?dish <http://dbpedia.org/ontology/country> ?country.
    ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
    ?dish rdfs:label ?label.
    ?dish <http://purl.org/dc/terms/subject> ?subject.
    ?dish <http://dbpedia.org/ontology/thumbnail> ?image.
    ?dish rdf:type <http://dbpedia.org/ontology/Food>.
    FILTER (LANG(?label) = "en")
    }
    GROUP BY ?label ?image
    HAVING (COUNT(distinct ?subject) >= 0)
    ORDER BY DESC(?count)
    LIMIT 50 &format=json`;

const animalByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
  ?animal <http://dbpedia.org/property/country> ?country.
  ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
  ?animal rdfs:label ?label.
  ?animal <http://purl.org/dc/terms/subject> ?subject.
  ?animal <http://dbpedia.org/ontology/thumbnail> ?image.
  ?animal <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Breed>.
  FILTER (LANG(?label) = "en")
  }
  GROUP BY ?label ?image
  HAVING (COUNT(distinct ?subject) >= 0)
  ORDER BY DESC(?count)
  LIMIT 50 &format=json`;

  

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
    LIMIT 10 &format=json`;

    const personByCountryQuery = (code:string)  => `https://dbpedia.org/sparql?query=
  PREFIX owl:<http://www.w3.org/2002/07/owl%23>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
  SELECT  ?label ?image (COUNT(distinct ?subject) as ?count) WHERE {
    ?people <http://dbpedia.org/ontology/birthPlace> ?place.
    ?place <http://dbpedia.org/ontology/country> ?country.
    ?country owl:sameAs <http://www.wikidata.org/entity/${code}>.
    ?people <http://purl.org/dc/terms/subject> ?subject.
    ?people <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:Living_people>.
    ?people <http://dbpedia.org/ontology/thumbnail> ?image.
    ?people rdfs:label ?label.
    FILTER (LANG(?label) = "en").
    FILTER (NOT EXISTS {?people <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Footballer>}).
    FILTER (NOT EXISTS {?people <http://purl.org/linguistics/gold/hypernym> <http://dbpedia.org/resource/Midfielder>}).
    }
    GROUP BY ?label ?image
    HAVING (COUNT(distinct ?subject) > 1)
    ORDER BY DESC(?count)
    LIMIT 20
     &format=json`;

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
    LIMIT 10
     &format=json`;

    
  const queriesMap:QUERIES_MAP = {
    musicianByCountry:musicianByCountryQuery,
    personByCountry:personByCountryQuery,
    personByRegion:personByRegionQuery,
    animalByCountry:animalByCountryQuery,
    riverByCountry:riverByCountryQuery,
    footballerByCountry:footballerByCountryQuery,
    actorByCountry:actorByCountryQuery,
    bandByCountry:bandByCountryQuery,
    location:locationQuery,
    dishByCountry:dishByCountryQuery,
    
  };

const getSparqlChoice = (theme:string, codeWD: string) => {
  
 // @ts-ignore
  const request$ = ajax(encodeURI(queriesMap[theme](codeWD)).replace(/%2523/g,'%23'))
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

  // const  randomIntFromInterval = (min:number, max:number) => { // min and max included 
  //   return Math.floor(Math.random() * (max - min + 1) + min);
  // }

  export {
    getSparqlChoice,
  };