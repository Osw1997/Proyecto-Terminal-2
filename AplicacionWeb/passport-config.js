/*
*   Para tener un codigo legible, se crea un super archivo para
*   la autentificacion de los usuarios
* */
/* Configuracion para passport */
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');
// Se declaran las variables de conexión
var coneccion = mysql.createConnection({
  host: 'localhost',
  user: 'user_pt2',
  password: 'ProyectoTerminal2'
});

// Se indica que BD se utiliza
coneccion.query('USE users_webapp');


function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        /* Se obtiene usuario por email */
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No existe el usuario con dicho email' });
        }
        /* En caso de que si exista */
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Contrasenia incorrecta' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' },
        authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
}

module.exports = initialize
