module.exports = {

  //receive_query: async function(query) {
  receive_query: function(query, proveniencia, res) {

    var request = require('request');
    // var options = {
    //   'method': 'POST',
    //   'url': 'http://ldp.ontohgis.pl/sparql/select',
    //   'headers': {
    //     'Origin': 'http://ldp.ontohgis.pl',
    //     'Accept-Encoding': 'gzip, deflate',
    //     'Accept-Language': 'es-US,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6',
    //     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36',
    //     'Content-Type': 'application/sparql-query;charset=UTF-8',
    //     'Accept': 'application/sparql-results+json',
    //     'Referer': 'http://ldp.ontohgis.pl/sparql/admin/squebi.html',
    //     'Cookie': 'JSESSIONID=4DAB335F0B08DDFDD879E16A27D50E31',
    //     'Connection': 'keep-alive'
    //   },
    //   body: query
    // };
    var options = {
      'method': 'POST',
      'url': 'http://localhost:8080/sparql/select',
      'headers': {
        'Origin': 'http://localhost:8080',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'es-US,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36',
        'Content-Type': 'application/sparql-query;charset=UTF-8',
        'Accept': 'application/sparql-results+json',
        'Referer': 'http://ldp.ontohgis.pl/sparql/admin/squebi.html',
        'Cookie': 'JSESSIONID=4DAB335F0B08DDFDD879E16A27D50E31',
        'Connection': 'keep-alive'
      },
      body: query
    };
    console.log('Query:' + query);
    if (proveniencia == 'consulta') {
      pagina_retorno = 'consulta.ejs';
    } else if (proveniencia == 'geoFederated') {
      pagina_retorno = 'consultaGeoFed.ejs';
    }

    //return new Promise(function(resolve, reject) {
      request(options, function (error, response) {
        if (error || response.statusCode != 200) {
          //throw new Error(error);
          console.log('--> Error');
          console.log(error);
          //obj = [false, 'Mensaje de fallo :c', '']

          res.render(pagina_retorno, {
            text_box: query,
            results: 'Error en consulta',
            msg: 'Hubo un error en la consulta / servidor',
            ok: false
          });
        } else {
          //console.log(response.body);
          console.log('--> Éxito!');
          res.render(pagina_retorno, {
            text_box: query,
            results: response.body,
            msg: 'Bien hecho',
            ok: true
          });
          //obj = [true, 'Mensaje de exito :D', response.body]
        }
        //resolve(response);
      //});

    });
      // console.log(query);
      /*
      if (query.length < 10 && query.length) {
          return [true, 'Mensaje de exito :D', 'resultados 1,2,3']
      } else {
          return [false, 'Mensaje de fallo :c', '']
      }
      */
  }
};
