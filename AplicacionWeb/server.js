/*
  Se definen las variables necesarias de 'express' para la aplicacion web
*/
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const passport = require('passport');
const override = require('method-override');


var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

/* Se inicializa 'passport' para la autenficacion de usuarios */
/*
const inicializa_passport = require('./passport-config.js');
inicializa_passport(
    passport,
    mysql,
  email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);
*/

// Se declaran los archivos estáticos
app.use('/Scripts', express.static('./Scripts/'))

// Se importa el archivo Passport
const inicializa_passport2 = require('./passport.js');
inicializa_passport2(passport);

/* Archivo que comunica este servidor con Apache Marmotta */
const server_to_marmotta = require('./procesa_query');

/* Archivo que se encarga de hacer las consultas de usuarios a mariaDB */
//const query_db = require('./query_usuarios')

/* Se utiliza el sioguiente arreglo para el almacenaje de usuarios */
const users = [];

/*La sig. constante es para la manipulación de contrasenias Hash*/
const bcrypt = require('bcrypt');

/**/
const flash = require('express-flash');
/**/
const session = require('express-session');

/* Para usar la sintaxis de 'ejs', se declara lo siguiente */
app.set('view-engine', 'ejs');
/* Use information in login and register views into post methods */
app.use(express.urlencoded({ extended: false }));
/**/
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
/**/
app.use(passport.initialize());
app.use(passport.session());
app.use(override('_method'));
// Para inicializar la BD
//app.use(passport.mariaDB_func());

/*
  Se define el método GET de la aplicación
    - '/' es la ruta origen de la aplicacion
    - res.render() devuelve el archivo 'index.ejs'
*/
app.get('/', protege_get, (req, res) => {

    //console.log('res.- tipo_usuario: ' + res.user.tipo_usuario);
    console.log('req.- tipo_usuario: ' + req.user.tipo_usuario);

  res.render('index.ejs', {
    name: req.user.name,
    tipo_usuario: req.user.tipo_usuario,
  })
});
/* Modo de operacion */
app.post('/dataset', protege_get, (req, res) => {
  const datasets = ['Ds1', 'Ds2', 'Ds3', "Ds10", "Ds15", 'Dse'];
  // Se cargan las consultas
  res.render('dataset.ejs', { datasets });
});
app.post('/consulta', protege_get, (req, res) => {
  res.render('consulta.ejs', {
    text_box: '',
    results: '',
    msg: '',
    ok: false,
  });
});
/* Realiza consulta consulta */
app.post('/check_query', protege_get, (req, res) => {
  server_to_marmotta.receive_query(req.body.consulta, req.body.proveniencia, res);
});
/*
app.post('/check_query', protege_get, asyncback(async (req, res, next) => {

    // async await style code
    const query = req.body.consulta;
    server_to_marmotta.receive_query(query).then(function(resultado) {
      console.log('Ahí va resultado: ');
      console.log(resultado.body);

      const status_query = resultado[0];
      const msj_query = resultado[1];
      const resultados = resultado[2];

      res.render('consulta.ejs', {
        text_box: query,
        results: resultados,
        msg: msj_query,
        ok: status_query
      });

    }).catch(function(v) {
      console.log('Error aqui route');
      console.log(v);
    });
}));
*/


/*
app.post('/check_query', protege_get, (req, res) => {

  // status_query = server_to_marmotta(req.body.)
  // res.render('vis_data.ejs');
  const query = req.body.consulta;
  const result_query = server_to_marmotta.receive_query(query);

  console.log('Ahí va resultado: ');
  console.log(result_query);

  const status_query = result_query[0];
  const msj_query = result_query[1];
  const resultados = result_query[2];

  console.log('Llegó aquí');

  res.render('consulta.ejs', {
        text_box: query,
        results: resultados,
        msg: msj_query,
        ok: status_query
      });
});
*/


/*
app.get('/check_query', protege_get, wrap(async (req, res, next) => {
  const query = req.body.consulta;
  const result_query = await server_to_marmotta.receive_query(query);

  console.log('Ahí va resultado: ');
  console.log(result_query);

  const status_query = result_query[0];
  const msj_query = result_query[1];
  const resultados = result_query[2];

  console.log('Llegó aquí');

  res.render('consulta.ejs', {
        text_box: query,
        results: resultados,
        msg: msj_query,
        ok: status_query
      });

  stream.on('error', next).pipe(res)
}))
*/

/* Visualiza datos */
app.post('/data_viz', protege_get, (req, res) => {
  const resultados = req.body.resultado;
  //console.log(resultados)
  res.render('vis_data.ejs', { resultados });
});

// Método para la consulta de datos geoespaciales usando consultas federadas
app.get('/geoFederated', protege_get, (req, res) => {
  res.render('geoFederated.ejs');
});

// Ruta para la consulta de datos federados
app.get('/consultaGeoFed', protege_get, (req, res) => {
  res.render('consultaGeoFed.ejs', {
    text_box: '',
    results: '',
    msg: '',
    ok: false,
  });
});


/* Se crea el metodo GET para 'Login'*/
app.get('/login', protege_get_no_auth, (req, res) => {
  res.render('login.ejs')
});
/* Se crea el método POST para 'Login'*/
/*
app.post('/login', protege_get_no_auth, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));
*/
app.post('/login', protege_get_no_auth, passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

/* Se crea el método GET para 'Register'*/
//app.get('/register', protege_get_no_auth, (req, res) => {
app.get('/register', protege_get, (req, res) => {

  //console.log('res.- tipo_usuario: ' + res.user.tipo_usuario);
  console.log('req.- tipo_usuario: ' + req.user.tipo_usuario);

  //console.log('tipo_usuario: ' + req.user.tipo_usuario);
  //res.render('register.ejs');

  if (req.user.tipo_usuario == 1){
    res.render('register.ejs')
  } else {
    //res.render('index.ejs', { name: req.user.name })
    res.render('index.ejs', {
      name: req.user.name,
      tipo_usuario: req.user.tipo_usuario,
    })
  }

});
/* Se crea el método POST para 'Register'*/
//app.post('/register', protege_get_no_auth, async (req, res) => {
app.post('/register', protege_get, passport.authenticate('local-signup', {

  successRedirect: '/',
  failureRedirect: '/register',
  failureFlash: true
  /*
  //res.render('register.ejs')
  try {
    const pwd_hashed = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: pwd_hashed,
      nivel: req.body.nivel,
      tipo_usuario: req.body.tipo_usuario
    });
    res.redirect('/login');
  } catch (e) {
    console.log(e);
    res.redirect('/register');
  }
  console.log(users);
  */
}));

/*
* Para desloguear al usuario
* */
app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});


/*
* Funcion que no permite acceder a ciertas paginas al usuario logueado
* */
function protege_get(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('autentico');
    return next();
  }
  res.redirect('/login');
}

function protege_get_no_auth(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('No autent');
    return res.redirect('/');
  }
  console.log('Eutentico 1');
  next();
}

/* se define el puerto por el que se escuchara la aplicacion*/
app.listen(2020);
