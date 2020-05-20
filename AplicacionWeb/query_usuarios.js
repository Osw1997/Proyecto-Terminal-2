/* Se indica la el paquete NPM a utilizar */
const mariadb = require('mariadb');
/* Se declaran las credenciales para accesar a la BD mariaDB */
const pool = mariadb.createPool({host: 'localhost', user:'user_pt2', password: 'ProyectoTerminal2', connectionLimit: 5});


/* Se indica la el paquete NPM a utilizar */
const mysql = require('mysql');

// Se declaran las variables de conexión
var coneccion = mysql.createConnection({
  host: 'localhost',
  user: 'user_pt2',
  password: 'ProyectoTerminal2',
  database: 'pt2'
});

coneccion.connect(function(error) {
  if (!error) {
    console.log('Error');
  } else {
    console.log('Conectado!');
  }
});
