// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var mysql = require('mysql');
const hsh_pwd = '-';

var connection = mysql.createConnection({
				  host     : 'localhost',
				  user     : 'user_pt2',
				  password : 'ProyectoTerminal2'
				});

connection.query('USE pt2');

// Código necesario para persitencia de sesiones.
module.exports = function(passport) {
    // Se registra al usuario en la sesión.
    passport.serializeUser(function(user, done) {
      console.log('0.- Serializo ID: ' + user.id);
      done(null, user.id);
    });

    // Se remueve al usuario de la sesión.
    passport.deserializeUser(function(id, done) {
      console.log('1.- deserializo ID: ' + id);
      connection.query("select * from users_appweb where id = " + id,function(err,rows){
	      done(err, rows[0]);
			});
    });

		/*
			Método para registrar a un nuevo usuario.
		*/
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
      console.log('---> Entró SIGNUP');
			// Se busca el correo ingresado para saber si existe o no.
      connection.query("select * from users_appweb where email = '" + email + "'", async function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err) {
        return done(err);
      }
			if (rows.length) {
        console.log('Email ya existe');
        return done(null, false, req.flash('signupMessage', 'Email ya existe.'));
      } else {
				// Se extraen los datos del usuario nuevo.
				var newUserMysql = new Object();
				newUserMysql.email = email;
				newUserMysql.password = await bcrypt.hash(password, 10);
				newUserMysql.name     = req.body.name;
				newUserMysql.nivel    = req.body.nivel;
				if (req.body.tipo_usuario == 'comun') {
				  newUserMysql.tipo_usuario = 0;
				} else {
				 newUserMysql.tipo_usuario = 1;
				}
				console.log('Email: ' + email);
				console.log('password: ' + newUserMysql.password);
				console.log('name: ' + req.body.name);
				console.log('nivel: ' + req.body.nivel);
				console.log('tipo_usuario: ' + newUserMysql.tipo_usuario);
				// Se crea consulta para la inserción del usuario en la base de datos.
				var insertQuery = "INSERT INTO users_appweb (name, email, password, nivel, tipo_usuario) values ('"  +
				                    req.body.name + "','" + email + "','" +
														newUserMysql.password + "','" + req.body.nivel +
														"','" + newUserMysql.tipo_usuario + "');";
				console.log('Query: ');
				console.log(insertQuery);
				// Se intenta ejecutar la consulta creada.
				try {
				  connection.query(insertQuery, function(err,rows) {
				    console.log(rows);
				    // Se selecciona el ultimo ID para deserializar el usuario
				    newUserMysql.id = rows.insertId;
				    return done(null, newUserMysql);
				  });
				} catch (error) {
				  console.log(error);
				}

      }
		});
    }));

    /*
			Método para iniciar sesión.
		*/
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
			// Se busca en la base de datos que el usuario ingresado exista.
      console.log('--> Entró login');
      connection.query("SELECT * FROM `users_appweb` WHERE `email` = '" + email + "';",function(err,rows){
			if (err)
      	return done(err);
			if (!rows.length) {
      	console.log('Usuario no existe.');
      	return done(null, false, req.flash('loginMessage', 'Usuario no existe.'));
      }
			// Sigue corroborar que la contraseña ingresada coincida con el correo.
			bcrypt.compare(password, rows[0].password, function(err, res) {
				if(err) {
					console.log(err);
					return done(err);
				}
				if(res) {
					console.log(password);
					req.tipo_usuario = rows[0].tipo_usuario;
					console.log('Tipo usuario: ' + req.tipo_usuario);
					console.log(rows[0]);
					return done(null, rows[0]);
				} else {
					console.log(password);
          console.log('Contraseña incorrecta.');
					// alert('Consta')
          return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.'));
				}
			});

		});
  }));
};
