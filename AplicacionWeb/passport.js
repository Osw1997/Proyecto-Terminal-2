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

// expose this function to our app bcrypt.hash(req.body.password, 10)using module.exports
module.exports = function(passport) {
//function mariaDB_func(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize thebcrypt.hash(req.body.password, 10) user for the session
    passport.serializeUser(function(user, done) {
      console.log('0.- Serializo ID: ' + user.id);
      done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      console.log('1.- deserializo ID: ' + id);
      connection.query("select * from users_appweb where id = " + id,function(err,rows){
      done(err, rows[0]);
		});
    });


 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {

      console.log('---> Entró SIGNUP');

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
      connection.query("select * from users_appweb where email = '" + email + "'", async function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err) {
        return done(err);
      }
			if (rows.length) {
        console.log('Email ya existe');
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {
				// if there is no user with that email
        // create the user
       var newUserMysql = new Object();
       newUserMysql.email = email;
       newUserMysql.password = await bcrypt.hash(password, 10);
       //newUserMysql.password = hashPassword(password);
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
				//var insertQuery = "INSERT INTO users_appweb ( email, password ) values ('" + email +"','"+ password +"')";
        var insertQuery = "INSERT INTO users_appweb (name, email, password, nivel, tipo_usuario) values ('"  +
                            req.body.name + "','" + email + "','" + newUserMysql.password + "','" + req.body.nivel + "','" + newUserMysql.tipo_usuario + "');";
        console.log('Query: ');
				console.log(insertQuery);
        try {
          connection.query(insertQuery, function(err,rows) {
            console.log(rows);
            // Se selecciona el ultimo ID para deserializar el usuario

            newUserMysql.id = rows.insertId;
            //newUserMysql.id = 3;
            return done(null, newUserMysql);
          });
        } catch (error) {
          console.log(error);
        }

            }
		});
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

      console.log('--> Entró login');
         connection.query("SELECT * FROM `users_appweb` WHERE `email` = '" + email + "'",function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                console.log('No user found.');
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

			// if the user is found but the password is wrong
            // if (!( rows[0].password == password)) {
            if(!(bcrypt.compare(rows[0].password, password))) {
                console.log(password);
                console.log('Oops! Wrong password.');
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
              }
            // all is well, return successful user
            req.tipo_usuario = rows[0].tipo_usuario;
            console.log('Tipo usuario: ' + req.tipo_usuario);
            console.log(rows[0]);
            return done(null, rows[0]);

		});



    }));

};

//module.exports = mariaDB_func
