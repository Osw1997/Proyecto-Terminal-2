
var mysql = require('mysql');
var connection = mysql.createConnection({
				  host     : 'localhost',
				  user     : 'user_pt2',
				  password : 'ProyectoTerminal2'
				});

connection.query('USE pt2');

module.exports = {
	remove_user: function(res, passport, email, adminEmail) {

    if (email == adminEmail) {
      msg_log = 'El administrador no puede eliminarse a si mismo.';
      console.log(msg_log);
      res.render('darBaja.ejs', {
        msg: msg_log,
        ok: false
      })
    }

		console.log('--> Entró darBaja - user\'s email: ' + email);
		connection.query("SELECT * FROM `users_appweb` WHERE `email` = '" + email + "'", function(err, rows){
			// Si usuario no existe u ocurrió un error
			if(err) {
        msg_log = 'Error en consulta a MySQL';
        console.log(msg_log);
        console.log(err);
        res.render('darBaja.ejs', {
          msg: msg_log,
          ok: false
        })
      }
				//return done(err);
			if(!rows.length) {
        msg_log = "Usuario con email " + email + " no existe";
				console.log(msg_log);
        res.render('darBaja.ejs', {
          msg: msg_log,
          ok: false
        })
				//return done(null, false, req.flash('bajaMensaje', 'Email no existe.'));
			}
			// Si el usuario existe, dalo de baja
			try {
				connection.query("DELETE from `users_appweb` WHERE `email` = '" + email + "';", function(err, rows) {
					if(err) {
            msg_log = 'Error en eliminación de usuario';
						console.log(msg_log);
            console.log(err);
            res.render('darBaja.ejs', {
              msg: msg_log,
              ok: false
            })
						//return done(err);
					}
          msg_log = "Usuario eliminado";
          console.log(msg_log)
          res.render('darBaja.ejs', {
            msg: msg_log,
            ok: true
          })
					//return done(null, null);
				});
			} catch (error) {
				console.log(error);
			}
		});
	}
};
