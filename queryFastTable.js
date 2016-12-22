const r = require('rethinkdbdash')({host: 'localhost', port: 28015, db: 'test' });


const sTable = 'incidents';


const center    = [-73.993549, 40.727248];
const lowerLeft = [-74.009180, 40.716425];
const deltaLon  = 2 * Math.abs(lowerLeft[0] - (-73.97725));
const deltaLat  = 2 * Math.abs(lowerLeft[1] - (40.7518692));

// const NQueries = 10000;
const NQueries = 100;
const N = 20;


let t0 = Date.now();

let aPromises = [];
for (let i=0;i < NQueries;i++) {
  const searchLon       = lowerLeft[0] + Math.random() * deltaLon;
  const searchLat       = lowerLeft[1] + Math.random() * deltaLat;
  const halfWinLon      = Math.random() * 0.04;
  const halfWinLat      = Math.random() * 0.04;

  const lowerLatitude   = searchLat - halfWinLat;
  const lowerLongitude  = searchLon - halfWinLon;
  const upperLatitude   = searchLat + halfWinLat;
  const upperLongitude  = searchLon + halfWinLon;


  let aQuery = r.table(sTable)
  .orderBy({ index: r.desc('ts')})
  .filter(function (oIncident) {
    return oIncident('latitude').gt(lowerLatitude)
      .and(oIncident('latitude').lt(upperLatitude))
      .and(oIncident('longitude').gt(lowerLongitude))
      .and(oIncident('longitude').lt(upperLongitude))
  })
  // .between(lowerLatitude, upperLatitude, { index: 'latitude'})
  // .orderBy(r.desc('ts'))
  // .filter(function (oIncident) {
  //   return oIncident('latitude').gt(lowerLatitude);
  // })
  // .filter(function (oIncident) {
  //   return oIncident('latitude').lt(upperLatitude);
  // })
  // .filter(function (oIncident) {
  //   return oIncident('longitude').gt(lowerLongitude);
  // })
  // .filter(function (oIncident) {
  //   return oIncident('longitude').lt(upperLongitude);
  // })
  .limit(N)
  .then( (results) => {
    // console.log({ action: 'query', results: results, ll: [lowerLatitude,upperLatitude,lowerLongitude,upperLongitude] });
    return results
  })

  aPromises.push(aQuery);
}


Promise.all(aPromises).then( (aResults) => {
  let t1 = Date.now();
  console.log({ queriesTimeMS: t1-t0, queriesPerSecond: NQueries / ( (t1-t0)/1000 ) })
  for (let i in aResults) {
    const result = aResults[i];
    const aKeys = result.map( (oMatch) => oMatch.id )
    // console.log({ action: 'query', aKeys: aKeys });
  }
})
.catch( (err) => {
  throw err;
})       
