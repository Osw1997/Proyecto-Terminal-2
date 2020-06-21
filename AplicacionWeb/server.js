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

// Se declaran los archivos estáticos
app.use('/Scripts', express.static('./Scripts/'))
// Se importa el archivo Passport
const inicializa_passport2 = require('./passport.js');
inicializa_passport2(passport);
/* Archivo que comunica este servidor con Apache Marmotta */
const server_to_marmotta = require('./procesa_query');
/* Archivo para verificar conexión a Internet */
const conectaInternet = require('./conectaInternet.js');
/* Archivo que sirve para eliminar el usuario dado por el administrador. */
const eliminaUsuario = require('./removeUser');
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

/*
  Se define el método GET de la aplicación
  - '/' es la ruta origen de la aplicacion
*/
app.get('/', protege_get, (req, res) => {
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
  server_to_marmotta.receive_query(req.body.consulta, req.body.proveniencia, res, null);
});

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
  // Se hace prueba de conexión a Apache Marmotta e Internet.
  sparqlTest = "select * where {?s ?p ?o .} limit 5";
  conexionAM = false;
  conexionInternet = false;
  // Se anidan callbacks para obtener el estatus primero de la conexión
  // a Apache Marmotta y luego la conexión a Internet. Después, se devuelve
  // la página adecuada.
  server_to_marmotta.receive_query(sparqlTest, 'login', res, function(conexionAM) {
    conectaInternet.prueba(function(conexionInternet){
      console.log("Conexión a Apache Marmotta: " + conexionAM);
      console.log("Conexión a Internet: " + conexionInternet);
      // Si ambas conexiones fueron exitosas, muestra pantalla login.
      if (conexionAM && conexionInternet) {
        res.render('login.ejs')
      } else {
        res.render('falla.ejs', {
          conexionAM,
          conexionInternet
        });
      }
    });
  });
});

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
app.post('/register', protege_get, passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/register',
  failureFlash: true
}));

/*
  Ruta para dar de baja usuario (GET)
*/
app.get('/darBaja', protege_get, (req, res) => {
  if (req.user.tipo_usuario == 1){
    res.render('darBaja.ejs', {
      ok: false,
      msg: ''
    })
  } else {
    //res.render('index.ejs', { name: req.user.name })
    res.render('index.ejs', {
      name: req.user.name,
      tipo_usuario: req.user.tipo_usuario,
    })
  }
});
/*
  Ruta para dar de baja usuario (POST)
*/
app.post('/darBaja', protege_get, (req, res) => {
  eliminaUsuario.remove_user(res, passport, req.body.email, req.user.email)
});

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
