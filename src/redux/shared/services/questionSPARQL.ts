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

interface Choice {
  label:string;
  image:string;
  topic:string;
  codeWD:string;
}

let choicesMatrix:Choice[] = [];

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
const capitalByCountryQuery = (code:string) => {

  const proxyurl = "https://quiz-magnet.herokuapp.com/";
  return `${proxyurl}https://query.wikidata.org/sparql?query=
  SELECT distinct ?capitalLabel ?label ?image
  WHERE {
  ?capital wdt:P18 ?image.
  wd:${code} wdt:P36 ?capital.
  VALUES (?label) {("-")}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }          
} LIMIT 1 &format=json`}

////////////////
const townByCountryQuery = (code:string) => {

  const proxyurl = "https://quiz-magnet.herokuapp.com/";
  return `${proxyurl}https://query.wikidata.org/sparql?query=
  SELECT distinct ?town ?townLabel (?townLabel as ?label) ?image ?population
  WHERE{
  ?town wdt:P31 wd:Q1549591.
  ?town wdt:P18 ?image.
  ?town wdt:P17 wd:${code}.
  ?town wdt:P1082 ?population.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}
  }ORDER BY DESC(?population)LIMIT 50 &format=json`}

////////////////
const mountainByCountryQuery = (code:string) => {

  const proxyurl = "https://quiz-magnet.herokuapp.com/";
  return `${proxyurl}https://query.wikidata.org/sparql?query=
  SELECT distinct  ?mountainLabel (?mountainLabel AS ?label) ?image ?altitude 
  WHERE{
  ?mountain wdt:P31 wd:Q46831.
  ?mountain wdt:P18 ?image.
  ?mountain wdt:P17 wd:${code}.
  ?mountain wdt:P17 ?country.  
  ?mountain wdt:P2044 ?altitude  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}
  }
  GROUP BY ?mountain ?mountainLabel ?image ?altitude
  HAVING (COUNT(distinct ?country) < 2)
  ORDER BY DESC(?altitude)LIMIT 50 &format=json`}

////////////////
const logoByCountryQuery = (code:string) => {

  const proxyurl = "https://quiz-magnet.herokuapp.com/";
  return `${proxyurl}https://query.wikidata.org/sparql?query=
  SELECT distinct  ?companyLabel (?companyLabel as ?label) ?image (COUNT(distinct ?country) AS ?count)
WHERE{
?company wdt:P31 wd:Q6881511.
?company wdt:P154 ?image.
?company wdt:P17 wd:${code}.
?company wdt:P17 ?country.
FILTER (?company NOT IN (wd:Q9584)) 
SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}
}
GROUP BY ?companyLabel ?image
HAVING (COUNT(distinct ?country) < 2)
ORDER BY DESC(?total)LIMIT 50 &format=json`}
////////////////

const bandByCountryQuery = (code:string)  => {
const proxyurl = "https://quiz-magnet.herokuapp.com/";
return `${proxyurl}https://query.wikidata.org/sparql?query=
  SELECT distinct  ?bandLabel (?bandLabel as ?label) ?image
  WHERE{
  ?band wdt:P31 ?type.
  ?band wdt:P18 ?image.
  ?band wdt:P495 wd:${code}.
  ?band wdt:P495 ?country.
  ?band wdt:P264 ?record.
  OPTIONAL {?band wdt:P166 ?award}
  FILTER (?type IN (wd:Q215380,wd:Q5741069)) 
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}
  }
  GROUP BY ?band ?bandLabel ?image ?record ?award
  HAVING (COUNT(distinct ?country) < 2)
  LIMIT 50&format=json`;
}


const actorByCountryQuery = (code:string)  => {
const proxyurl = "https://quiz-magnet.herokuapp.com/";
return `${proxyurl}https://query.wikidata.org/sparql?query=
  SELECT distinct  ?actorLabel (?actorLabel as ?label) ?image
WHERE{
?actor wdt:P106 wd:Q10800557.
?actor wdt:P18 ?image.
?actor wdt:P27 wd:${code}.
?actor wdt:P27 ?country.
OPTIONAL {?actor wdt:P1411 ?nomination}
SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}
}
GROUP BY ?actor ?actorLabel ?image ?nomination
HAVING (COUNT(distinct ?country) < 2)
ORDER BY (?nomination)
LIMIT 50 &format=json`;}

  const footballerByCountryQuery = (code:string)  => {
    const proxyurl = "https://quiz-magnet.herokuapp.com/";
    return `${proxyurl}https://query.wikidata.org/sparql?query=
    SELECT distinct  ?footballerLabel (?footballerLabel as ?label) ?image
    WHERE{
    ?footballer wdt:P106 wd:Q937857.
    ?footballer wdt:P18 ?image.
    ?footballer wdt:P1532 wd:${code}.
    ?footballer wdt:P27 wd:${code}.
    ?footballer wdt:P27 ?country.
      ?footballer wdt:P1344 ?tournament.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}
    }
    GROUP BY ?footballer ?footballerLabel ?image
    HAVING (COUNT(distinct ?country) < 2)
    LIMIT 20 &format=json`;
  }


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

  const dishByCountryQuery = (code:string)  => {
  const proxyurl = "https://quiz-magnet.herokuapp.com/";
  return `${proxyurl}https://query.wikidata.org/sparql?query=
  SELECT distinct  ?dishLabel (?dishLabel as ?label) ?image
  WHERE{
  ?dish wdt:P279 ?type.
  ?dish wdt:P18 ?image.
  ?dish wdt:P495 wd:${code}.
  ?dish wdt:P495 ?country.
  FILTER (?type IN (wd:Q746549,wd:Q2095)) 
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}
  }
  GROUP BY ?dish ?dishLabel ?image
  HAVING (COUNT(distinct ?country) < 2)
  LIMIT 50 &format=json`;}

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
    capitalByCountry:capitalByCountryQuery,
    townByCountry:townByCountryQuery,
    mountainByCountry:mountainByCountryQuery,
    logoByCountry:logoByCountryQuery,
    
  };

const getSparqlChoice = (topic:string, codeWD: string) => {

  const targetChoicesMatrix = choicesMatrix.filter(choice => choice.topic === topic && choice.codeWD === codeWD);
  if(targetChoicesMatrix.length > 0) {
    console.log('IN targetChoicesMatrix',targetChoicesMatrix);
    
    const randomArticle = targetChoicesMatrix[randomIntFromInterval(0,targetChoicesMatrix.length-1)];
    return of (
      {
       label:randomArticle.label,
       image: randomArticle.image,
      }
    )
    
  }
 // @ts-ignore
 //bug with hastag char, it needs to be modified after encoding the URL
  const request$ = ajax(encodeURI(queriesMap[topic](codeWD)).replace(/%2523/g,'%23'))
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
         choicesMatrix = choicesMatrix.concat(results.map( (el:any) => { 
          return { 
             label: el.label.value,
             image: el.image.value,
             topic: topic,
             codeWD:codeWD
             }
         }))
      
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