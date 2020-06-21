// Función para corroborar conexión a Internet mediante resulción DNS a Google.
module.exports = {
  prueba: function(callback) {
    require('dns').resolve('www.google.com', function(err) {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }
};
