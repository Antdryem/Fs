/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//carga los datos por defecto

var lugares_info = [];
var nombres=[];
window.onload = function () {
    tomar_estados();
    cargar_gasolineras();
}


function cargar_gasolineras() {//carga e imprime los datos de las gasolineras, en base al filtro
    $.ajax({
        url: "backend/switch_acciones.php",
        type: "post",
        data: {
            accion: 3,
            paginacion: $("input[id=pagina_actual]").val(),
            municipio: $("select[id=filtro_municipio]").val(),
            estado: $("select[id=filtro_estado]").val(),
            codigo_postal: $("input[id=filtro_cp]").val(),
            tamano_consulta: $("input[id=tamano]").val(),
            modo: 0, //modo 0 es tomar datos, modo 1 es contar la cantidad de registros
        },
        success: function (salida) {
            console.log($.parseJSON(salida));
            paginador();
            $("tbody").html("");
            locations=[];
            nombres=[];
            $.parseJSON(salida).forEach(
                    function (objeto, id) {
                    locations.push({lat: parseFloat(objeto.latitude), lng: parseFloat(objeto.longitude)});
                    nombres.push(objeto._id);
                        $("tbody").append("<tr>\n\
                            <td>" + objeto._id + "</td>\n\
                            <td>" + objeto.razonsocial + "</td>\n\
                            <td>" + objeto.calle + "</td>\n\
                            <td>" + objeto.codigopostal + "</td>\n\
                        </tr>");
//
//                            <td>" + objeto.longitude + "</td>\n\
//                            <td>" + objeto.latitude + "</td>\n\
//                        var informacion = {
//                            posicion: {lat: objeto.latitude, lng: objeto.longitude},
//                            nombre: objeto.calle
//                        }
//
//                        lugares_info.push(informacion);
                        //crear_marcador_mapa(parseFloat(objeto.latitude), parseFloat(objeto.longitude), objeto.calle);
                    
                    }    
            );
        initMap();
        alert("Carga finalizada");
        }
    });
}

function tomar_estados() { //imprime los 32 estados de mi México chingón :')
    $.ajax({
        url: "backend/switch_acciones.php",
        type: "post",
        data: {
            accion: 1
        },
        success: function (salida) {
            $.parseJSON(salida).forEach(function (objeto, id) {
                $("select[id=filtro_estado]").append("<option value=" + objeto[0] + " >" + objeto[1] + "</option>");
            });
        }
    });
}

function cambiar_municipios(id_estado) {//actualiza el select de municipios en base al select de estados
    $.ajax({
        url: "backend/switch_acciones.php",
        type: "post",
        data: {
            accion: 2,
            id_estado: id_estado
        },
        success: function (salida) {
            var select_html = "<option value=0 selected>Sin filtro</option>";
            $.parseJSON(salida).forEach(function (objeto, id) {
                select_html += "<option value=" + objeto[0] + ">" + objeto[1] + "</option>";
            });
            $("select[id=filtro_municipio]").html(select_html);
        }

    });
}

function paginador() {//Muestra, en base al los filtros y el tamaño de la busqueda, cuantas páginas hay para consultar
    $.ajax({
        url: "backend/switch_acciones.php",
        type: "post",
        data: {
            accion: 3,
            paginacion: $("input[id=pagina_actual]").val(),
            municipio: $("select[id=filtro_municipio]").val(),
            estado: $("select[id=filtro_estado]").val(),
            codigo_postal: $("input[id=filtro_cp]").val(),
            tamano_consulta: $("input[id=tamano]").val(),
            modo: 1, //modo 0 es tomar datos, modo 1 es contar la cantidad de registros
        },
        success: function (salida) {
            console.log(salida);
            if ($("input[id=tamano]").val() == "0" || $("input[id=tamano]").val() == "")
                var numero = 15;
            else
                var numero = $("input[id=tamano]").val();

            $("a[id=paginas_totales]").text(Math.ceil(salida / numero));
        }
    });
}

function initMap() {//crea o recarga el mapa, con los marcadores dentro de

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {lat: 19.5, lng: -99}
    });
    var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: location,
            label: nombres[i],
        });
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}
var locations = [
]
