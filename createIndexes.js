const r = require('rethinkdb');

r.connect( {host: 'localhost', port: 28015, db: 'test'}, (err, conn) => {
  if (err) throw err;

  const sTable = 'incidents';

  r.table(sTable).indexCreate('ts').run(conn).then( (result) => {
    console.log({ action: 'indexCreate ts', result: JSON.stringify(result, null, 2) });
  })
  r.table(sTable).indexCreate('latitude').run(conn).then( (result) => {
    console.log({ action: 'indexCreate latitude', result: JSON.stringify(result, null, 2) });
  })
  r.table(sTable).indexCreate('longitude').run(conn).then( (result) => {
    console.log({ action: 'indexCreate longitude', result: JSON.stringify(result, null, 2) });
  })
  .then( () => {
    return r.table(sTable).indexCreate('ll', {multi: true}).run(conn);
  })
  .then( (result) => {
    console.log({ action: 'indexCreate ll', result: JSON.stringify(result, null, 2) });
    process.exit(0);
  })
  .catch( (err) => {
    throw err;
  })

});