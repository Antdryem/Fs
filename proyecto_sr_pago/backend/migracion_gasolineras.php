<?php

// $_POST

$link = mysqli_connect("localhost", "root", "", "prueba");

$valores="";
foreach($_POST['datos'] as $nombre => $valor){ //toma cada uno de los valores de  la gasolinera, por orden, para después agregarlos a una consulta donda serán ingresados
    //if($nombres!=="")
    //    $nombres.=",";
    if($valores!=="")
        $valores.=",";
    $valores.="'$valor'";
}

$sql="insert into gasolineras (_id,calle,rfc,date_insert,regular,colonia,numeropermiso,fechaaplicacion,permisoid,longitude,latitude,premium,razonsocial,codigopostal,dieasel) values ($valores)";

if($link->query($sql)){
    echo "1";
}else{
    echo $sql;
}