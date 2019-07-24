/**
 * Created by rhtvma on 1/21/2019.
 */
var SequelizeAuto = require('sequelize-auto')
// var auto = new SequelizeAuto("ImmixCloud", "MicrosoftAccount\\rohit.rkv@outlook.com", '');


var auto = new SequelizeAuto("rhtvma", "MicrosoftAccount\\rohit.rkv@outlook.com", '',{
    host: 'localhost',
    port:'47536'
});

auto.run(function (err) {
    if (err) throw err;
    console.log(auto.tables); // table list
    console.log(auto.foreignKeys); // foreign key list
});

/* //if you want to use with specified options
 var auto = new SequelizeAuto('database', 'user', 'pass', {
 host: 'localhost',
 dialect:  mysql, //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql', but install perticular dialect
 directory: false, // prevents the program from writing to disk
 port: 'port',
 additional: {
 timestamps: false
 //...
 },
 //tables:['table1', 'table2', 'table3']
 //...
 })*/
