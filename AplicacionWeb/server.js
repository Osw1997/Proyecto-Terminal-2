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

/* Se inicializa 'passport' para la autenficacion de usuarios */
const inicializa_passport = require('./passport-config.js');
inicializa_passport(
    passport,
  email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

/* Archivo que comunica este servidor con Apache Marmotta */
const server_to_marmotta = require('./procesa_query');


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

/*
  Se define el método GET de la aplicación
    - '/' es la ruta origen de la aplicacion
    - res.render() devuelve el archivo 'index.ejs'
*/
app.get('/', protege_get, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
});
/* Modo de operacion */
app.post('/dataset', protege_get, (req, res) => {
  const datasets = ['Ds1', 'Ds2', 'Ds3', "Ds10", "Ds15", 'Dse'];
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
/* Checha consulta */
app.post('/check_query', protege_get, (req, res) => {
  // status_query = server_to_marmotta(req.body.)
  // res.render('vis_data.ejs');
  const query = req.body.consulta;
  const result_query = server_to_marmotta.receive_query(query);
  const status_query = result_query[0];
  const msj_query = result_query[1];
  const resultados = result_query[2];
  res.render('consulta.ejs', {
        text_box: query,
        results: resultados,
        msg: msj_query,
        ok: status_query
      });
});

/* Visualiza datos */
app.post('/data_viz', protege_get, (req, res) => {
  const resultados = req.body.resultado;
  console.log(resultados)
  res.render('vis_data.ejs', { resultados });
});

/* Se crea el metodo GET para 'Login'*/
app.get('/login', protege_get_no_auth, (req, res) => {
  res.render('login.ejs')
});
/* Se crea el método POST para 'Login'*/
app.post('/login', protege_get_no_auth, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

/* Se crea el método GET para 'Register'*/
app.get('/register', protege_get_no_auth, (req, res) => {
  res.render('register.ejs')
});
/* Se crea el método POST para 'Register'*/
app.post('/register', protege_get_no_auth, async (req, res) => {
  //res.render('register.ejs')
  try {
    const pwd_hashed = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: pwd_hashed,
      nivel: req.body.nivel
    });
    res.redirect('/login');
  } catch (e) {
    console.log(e);
    res.redirect('/register');
  }
  console.log(users);
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
