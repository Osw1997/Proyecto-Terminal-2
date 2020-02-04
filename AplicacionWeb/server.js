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
      password: pwd_hashed
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
