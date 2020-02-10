module.exports = {
    receive_query: function(query) {
        // console.log(query);
        if (query.length < 10 && query.length) {
            return [true, 'Mensaje de exito :D', 'resultados 1,2,3']
        } else {
            return [false, 'Mensaje de fallo :c', '']
        }
    }
};
