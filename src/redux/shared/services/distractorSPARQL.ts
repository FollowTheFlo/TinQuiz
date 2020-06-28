import { from, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, catchError, switchMap, concatMap } from "rxjs/operators";

interface WDResponse {
    label: string;
    code: string;
}

function randomIntFromInterval(min:number, max:number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

const getSparqlCountryList = (countryWD: string) => {

    const proxyurl = "https://quiz-magnet.herokuapp.com/";
    const queryCountryList = `
    SELECT distinct ?countryLabel ?country ?population
        WHERE {
        wd:${countryWD} wdt:P31 ?hypernym.
        wd:${countryWD} wdt:P30 ?continent.
        ?country wdt:P31 ?hypernym.
        ?country wdt:P30 ?continent.
        ?country wdt:P1082 ?population.
        FILTER NOT EXISTS { ?country wdt:P576 ?existedInPast.}
        FILTER ( ?population >= 1000000)
        FILTER ( ?country != wd:${countryWD})
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY DESC(?population)
    `
    const  request$ = ajax(
        {
            url: proxyurl + 'https://query.wikidata.org/sparql', 
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-query',
                'Accept': 'application/sparql-results+json'
            },
            body: queryCountryList
        }
      ).pipe(
        map(response => {
            console.log('response: ', response.response.results.bindings)
            return response.response.results.bindings;
        
        }),
        map((results:any[]) => {
             const fullList: WDResponse[] = results.map( (el:any) => { 
                 return { 
                    label: el.countryLabel.value,
                    code: el.country.value.replace("http://www.wikidata.org/entity/",""),
                    }
                })
            //const index = fullList.findIndex(el => el.code === countryWD);
            return fullList[randomIntFromInterval(0,fullList.length-1)];
            //get the DBPedia article from WikiData code
            //return getDBPfromWD(selectedCountry.code);
            
        }),
        catchError(error => {
          console.log('error: ', error);
          return of(error);
        })
      )
    return request$;
  }

  const getSparqlRegionList = (regionWD: string) => {

    const proxyurl = "https://quiz-magnet.herokuapp.com/";
    const queryCountryList = `
    SELECT distinct ?regionLabel ?region ?population
    WHERE {
    wd:${regionWD} wdt:P31 ?hypernym.
    ?region wdt:P31 ?hypernym.
    ?region wdt:P1082 ?population.
    FILTER NOT EXISTS { ?region wdt:P576 ?existedInPast.}
    FILTER (?region != wd:${regionWD} )
    OPTIONAL{?region wdt:P18 ?image.}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    ORDER BY DESC(?population)
    LIMIT 500
    `
    const  request$ = ajax(
        {
            url: proxyurl + 'https://query.wikidata.org/sparql', 
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-query',
                'Accept': 'application/sparql-results+json'
            },
            body: queryCountryList
        }
      ).pipe(
        map(response => {
            console.log('response: ', response.response.results.bindings)
            return response.response.results.bindings;
        
        }),
        map((results:any[]) => {
             const fullList: WDResponse[] = results.map( (el:any) => { 
                 return { 
                    label: el.regionLabel.value,
                    code: el.region.value.replace("http://www.wikidata.org/entity/",""),
                    }
                })
            //const index = fullList.findIndex(el => el.code === regionWD);
            return fullList[randomIntFromInterval(0,fullList.length-1)];
         
            //get the DBPedia article from WikiData code
           // return getDBPfromWD(selectedRegion.code);
             
        }),

        catchError(error => {
          console.log('error: ', error);
          return of(error);
        })
      )
    return request$;
  }
  

  const getSparqlPlaceList = (placeWD: string) => {
      console.log('placeWD',placeWD);

      let selectedPlace = { 
        label: '',
        code: ''
      }

    const queryPlace = `https://dbpedia.org/sparql?query=
    PREFIX owl:<http://www.w3.org/2002/07/owl%23> 
    PREFIX ont:<http://dbpedia.org/ontology/> 
    PREFIX purl:<http://purl.org/linguistics/gold/> 
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema%23>
    SELECT ?place ?placeLabel WHERE 
    {
        ?target owl:sameAs <http://www.wikidata.org/entity/${placeWD}>.
        ?target purl:hypernym ?hypernym.
        ?target ont:country ?country.
        ?target ont:populationTotal ?targetPopulation.
        ?place ont:populationTotal ?placePopulation.
        ?place purl:hypernym ?hypernym.
        ?place ont:country ?country.
        ?place rdfs:label ?placeLabel.
        FILTER (LANG(?placeLabel) = "en")
        FILTER (?target != ?place )
    } 
    ORDER BY DESC(?placePopulation) 
    LIMIT 500&format=json`;
  
    //replace the hashtag char as bug
   const  request$ = ajax(encodeURI(queryPlace).replace(/%2523/g,'%23'))
     .pipe(
        map(response => {
            console.log('DBPEDIA response: ', response);
            return response.response.results.bindings;
        
        }),
        concatMap((results:any[]) => {
            const fullList: WDResponse[] = results.map( (el:any) => { 
                return { 
                   label: el.placeLabel.value,
                   code: el.place.value
                   }
               })
           //const index = fullList.findIndex(el => el.code === regionWD);
           selectedPlace = {...fullList[randomIntFromInterval(0,fullList.length-1)]};
           console.log('selectedPlace',selectedPlace);
           return getWDfromDBP(selectedPlace.code);
       }),
       map(codeWD => {
        selectedPlace.code = codeWD.replace("http://www.wikidata.org/entity/","");
       console.log('selectedPlace***********************', selectedPlace);
        return selectedPlace;
    }),
       catchError(error => {
         console.log('error: ', error);
         return of(error);
       })
       
      )
    return request$;
  }

  const getDBPfromWD = (placeWD: string) => {
    console.log('getDBPfromWD', placeWD);
    const queryEntityWD = `https://dbpedia.org/sparql?query=
    PREFIX owl:<http://www.w3.org/2002/07/owl%23>
    SELECT ?targetDBP
    {
        ?targetDBP owl:sameAs <http://www.wikidata.org/entity/${placeWD}>
    }
    LIMIT 1&format=json`;
    const request$ = ajax(encodeURI(queryEntityWD).replace(/%2523/g,'%23'))
    .pipe(
       map(response => {
           console.log('DBPEDIA response: ', response);
           return response.response.results.bindings[0].targetDBP.value;
       
       }),      

    catchError(error => {
        console.log('error: ', error);
        return of(error);
    })
       );
    return request$;
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
       map(response => {
           console.log('DBPEDIA response: ', response);
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
    getSparqlCountryList,
    getSparqlRegionList,
    getSparqlPlaceList,
  };
