/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function migrar_gasolina() {
    alert("hola");
    $.ajax({
        url: "https://api.datos.gob.mx/v1/precio.gasolina.publico?pageSize=11000", //consulta los datos
        success: function (salida) {
            salida["results"].forEach(function (objeto, id) { //toma individualmente cada gasolinera
                //console.log(id + "-------" +objeto.calle);

                $.ajax({
                    url: "backend/migracion_gasolineras.php",
                    type: "post",
                    data: {
                        datos: objeto, //guarda los datos de la gasolinera
                    },
                    success: function (hola) {
                        if (hola !== "1") {
                            console.log(hola);
                        }
                    },
                    error: function(){
                        alert("Error al descargar datos");
                    }
                });

            });

        }
    });
}