const r = require('rethinkdb');

r.connect( {host: 'localhost', port: 28015}).then( (conn) => {
  const sTable = 'incidents';


  const center    = [-73.993549, 40.727248];
  const lowerLeft = [-74.009180, 40.716425];
  const deltaLon  = 2 * Math.abs(lowerLeft[0] - (-73.97725));
  const deltaLat  = 2 * Math.abs(lowerLeft[1] - (40.7518692));

  const NQueries = 1;
  const N = 20;

  let aItems = [];
  for (let i=0;i < NQueries;i++) {
    const searchLon       = lowerLeft[0] + Math.random() * deltaLon;
    const searchLat       = lowerLeft[1] + Math.random() * deltaLat;
    const halfWinLon      = Math.random() * 0.04;
    const halfWinLat      = Math.random() * 0.04;

    const lowerLatitude   = searchLat - halfWinLat;
    const lowerLongitude  = searchLon - halfWinLon;
    const upperLatitude   = searchLat + halfWinLat;
    const upperLongitude  = searchLon + halfWinLon;


    r.table(sTable)
    .orderBy({ index: r.desc('ts')})
    .limit(N)
    .filter("lambda incident: incident['ll[0]'] >= ${lowerLatitude}" )
    .filter("lambda incident: incident['ll[0]'] <= ${upperLatitude}" )
    .filter("lambda incident: incident['ll[1]'] >= ${lowerLongitude}")
    .filter("lambda incident: incident['ll[1]'] >= ${upperLongitude}")
    .run(conn)
    .then( (cursor) => {
      cursor.toArray( (result) => {
        console.log({ action: 'query', result: result });
      })
    })
    .catch( (err) => {
      throw err;
    })
  }

})
.catch( (err) => {
  throw err;
})
