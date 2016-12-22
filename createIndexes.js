const r = require('rethinkdb');

r.connect( {host: 'localhost', port: 28015, db: 'test'}, (err, conn) => {
  if (err) throw err;

  const sTable = 'incidents';

  r.table(sTable).indexCreate('ts').run(conn)
  .catch( (err) => {
    console.log({ action: 'indexCreate ts err', err:err });
  })
  .then( (result) => {
    console.log({ action: 'indexCreate ts', result: JSON.stringify(result, null, 2) });
    return r.table(sTable).indexCreate('latitude').run(conn);
  })
  .catch( (err) => {
    console.log({ action: 'indexCreate latitude err', err:err });
  })
  .then( (result) => {
    console.log({ action: 'indexCreate latitude', result: JSON.stringify(result, null, 2) });
    return r.table(sTable).indexCreate('longitude').run(conn);
  })
  .catch( (err) => {
    console.log({ action: 'indexCreate longitude err', err:err });
  })  
  .then( (result) => {
    console.log({ action: 'indexCreate longitude', result: JSON.stringify(result, null, 2) });
    return r.table(sTable).indexCreate('latitude_ts, lambda x: [x["latitude"], x["ts"]]').run(conn);
  })
  .catch( (err) => {
    console.log({ action: 'indexCreate latitude_ts err', err:err });
  })  
  .then( (result) => {
    console.log({ action: 'indexCreate latitude ts', result: JSON.stringify(result, null, 2) });
    return r.table(sTable).indexCreate('longitude_ts, lambda x: [x["longitude"], x["ts"]]').run(conn);
  })
  .catch( (err) => {
    console.log({ action: 'indexCreate longitude_ts err', err:err });
  })  
  .then( (result) => {
    console.log({ action: 'indexCreate longitude ts', result: JSON.stringify(result, null, 2) });
    process.exit(0);
  })
  .catch( (err) => {
    throw err;
  })

});