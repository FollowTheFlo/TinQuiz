import { from, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, catchError, switchMap } from "rxjs/operators";

const getDBPfromWD = (placeWD: string) => {
    const queryEntityWD = `https://dbpedia.org/sparql?query=
    PREFIX owl:<http://www.w3.org/2002/07/owl%23>
    SELECT ?targetDBP
    {
        ?targetDBP owl:sameAs <http://www.wikidata.org/entity/${placeWD}>
    }
    LIMIT 1&format=json`;
    const request = ajax(encodeURI(queryEntityWD).replace(/%2523/g,'%23'))
    .pipe(
       map(response => {
           console.log('DBPEDIA response: ', response);
           return response.response.results.bindings[0].targetDBP.value;
       
       }),      

    catchError(error => {
        console.log('error: ', error);
        return of(error);
    })
       )
    .toPromise()
    return request;
  }


  const  randomIntFromInterval = (min:number, max:number) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const getWDfromDBP = (elDBP: string) => {
    console.log('getWDfromDBP', elDBP);
    const queryEntityWD = `https://dbpedia.org/sparql?query=
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema%23>
    PREFIX owl:<http://www.w3.org/2002/07/owl%23>
    SELECT ?code WHERE {
      <${elDBP}> rdfs:label ?placeLabel.
      <${elDBP}> owl:sameAs ?WDCode.
      BIND(STR(?WDCode) AS ?code).
      FILTER(STRSTARTS(?code,"http://www.wikidata")).
      FILTER (LANG(?placeLabel) = "en")
      }
      ORDER BY DESC(?placePopulation)
      LIMIT 1&format=json`;
    const request$ = ajax(encodeURI(queryEntityWD).replace(/%2523/g,'%23'))
    .pipe(
       map((response:any) => {
        console.log('DBPEDIA response: ', response);
        //extract code from the wikidata link
           return response.response.results.bindings[0].code.value.replace("http://www.wikidata.org/entity/","");  
       }),      

    catchError(error => {
        console.log('error: ', error);
        return of(error);
    })
       );
    return request$;
  }

  export {
      getDBPfromWD,
      getWDfromDBP,
      randomIntFromInterval,
  };