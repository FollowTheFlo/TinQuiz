import { ajax } from "rxjs/ajax";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { localFlagsList } from "../config/flagsList";

const getSparqlFlagList = (countryWDList: string[]) => {
  console.log("getSparqlFlagList1", countryWDList);

  return of(localFlagsList);
  // below when query flags from WikiData instead of hardcoded from localFlagsList
  // eslint-disable-next-line no-unreachable
  let countryWdListstring = "";
  countryWDList.forEach((codeURI) => (countryWdListstring += `<${codeURI}>,`));
  console.log("getSparqlFlagList2", countryWdListstring);
  const queryCountryList = `https://dbpedia.org/sparql?query=
  PREFIX owl:<http://www.w3.org/2002/07/owl%23>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>
  SELECT  ?country ?wdCode ?label ?image WHERE {
    ?country owl:sameAs ?wdCode.
  ?country <http://dbpedia.org/ontology/thumbnail> ?image.
 ?country rdfs:label ?label.
 FILTER (?wdCode IN (${countryWdListstring}))
 FILTER (LANG(?label) = "en")
   }
   ORDER BY ASC(?label)
   LIMIT 200
   &format=json`;

  console.log(
    "getSparqlFlagList3",
    encodeURI(queryCountryList.replace(",))", "))")).replace(/%2523/g, "%23")
  );

  const request$ = ajax(
    encodeURI(queryCountryList.replace(",))", "))")).replace(/%2523/g, "%23")
  ).pipe(
    map((response) => {
      console.log("queryCountryList response: ", response);
      return response.response.results.bindings;
    }),
    map((results: any[]) => {
      if (results.length === 0) {
        return { label: "", image: "" };
      }
      return results.map((el: any) => {
        return {
          label: el.label.value,
          image: el.image.value,
          WdCode: el.wdCode.value.replace(
            "http://www.wikidata.org/entity/",
            ""
          ),
          isSelected: false,
        };
      });
    }),

    catchError((error) => {
      console.log("error: ", error);
      return of(error);
    })
  );

  return request$;
};

interface WDResponse {
  label: string;
  code: string;
}

const getSparqlCountryWDCodeURIs = (countryWD: string) => {
  const proxyurl = "https://quiz-magnet.herokuapp.com/";
  const queryCountryList = `
    SELECT distinct ?countryLabel ?country ?population
        WHERE {
        wd:${countryWD} wdt:P31 ?hypernym.      
        ?country wdt:P31 ?hypernym.
        ?country wdt:P30 ?continent.
        ?country wdt:P1082 ?population.
        FILTER NOT EXISTS { ?country wdt:P576 ?existedInPast.}      
        FILTER ( ?population >= 4000000)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY DESC(?countryLabel)
    `;
  const request$ = ajax({
    url: proxyurl + "https://query.wikidata.org/sparql",
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      Accept: "application/sparql-results+json",
    },
    body: queryCountryList,
  }).pipe(
    map((response) => {
      console.log("response: ", response.response.results.bindings);
      return response.response.results.bindings;
    }),
    map((results: any[]) => {
      return results.map((el: any) => {
        return el.country.value;
      });
      //const index = fullList.findIndex(el => el.code === countryWD);
      // return fullList[randomIntFromInterval(0,fullList.length-1)];
      //get the DBPedia article from WikiData code
      //return getDBPfromWD(selectedCountry.code);
    }),
    catchError((error) => {
      console.log("error: ", error);
      return of(error);
    })
  );
  return request$;
};

export { getSparqlFlagList, getSparqlCountryWDCodeURIs };
