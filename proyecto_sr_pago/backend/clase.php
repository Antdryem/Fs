<?php

class gasolineras {

    protected $conexion;

    public function conectar() {//cada objeto cuenta con una conexión DB
        $this->conexion = mysqli_connect("localhost", "root", "", "prueba");
        if (mysqli_connect_errno($this->conexion)) {
            echo "Error al conectar con MySQL: " . mysqli_connect_error();
        } else {
            mysqli_set_charset($this->conexion, 'utf8');
        }
    }

    public function __construct() {//cada vez que se crea un objeto, se crea una conexión
        $this->conectar();
    }

    public function cerrar() {
        $this->conexion = null;
    }

    private function consulta_a_array($consulta) {//convierte el resultado de una consulta a un arreglo
        $arreglo_salida = array();
        while ($corrida = mysqli_fetch_array($consulta)) {
            array_push($arreglo_salida, $corrida);
        }
        //var_dump($arreglo_salida);
        return $arreglo_salida;
    }

    public function tomar_estados() {//listado de todos los estados de la republica
        $sql = "select *  from estado where 1";
        $resultado = $this->conexion->query($sql);
        return json_encode($this->consulta_a_array($resultado));
    }

    public function tomar_municipios($id_estado) {//listado de municipios en base al id_estado
        $sql = "select * from municipio where id_estado='$id_estado'";
        $resultado = $this->conexion->query($sql);
        return json_encode($this->consulta_a_array($resultado));
    }

    public function consultar_gasolineras($sintaxis, $paginacion, $tamano, $modo) {//en base a los filtros ingresados saca la consulta de gasolineras
        if ($modo == "0") {
            $sql = "select ";
        } elseif ($modo == "1") {
            $sql = "select count(*) ";
        }
        if ($sintaxis !== "") {
            if ($modo == "0")
                $aux = "";
            else
                $aux=",";
            $sql .= "$aux gasolineras.id_gasolineras, gasolineras._id, gasolineras.calle, gasolineras.rfc, gasolineras.date_insert, gasolineras.regular, gasolineras.colonia,
                    gasolineras.numeropermiso, gasolineras.fechaaplicacion, gasolineras.permisoid, gasolineras.longitude, gasolineras.premium, gasolineras.latitude, gasolineras.premium, gasolineras.razonsocial,
                    gasolineras.codigopostal, gasolineras.dieasel, estado.nombre as estado, municipio.nombre as municipio
                    FROM `municipio`, cp, estado, gasolineras WHERE cp.nombre=gasolineras.codigopostal and municipio.id_municipio=cp.id_municipio and municipio.id_estado=estado.id_estado and " . $sintaxis;
        } else {
            if ($modo == "0")
                $aux = "*";
            else
                $aux="";
            $sql .= " $aux from gasolineras where 1";
        }
        if($modo=="0"){
            $sql.=" limit " . ($paginacion-1) * $tamano . "," . $tamano;
            $resultado=  $this->conexion->query($sql);
            if($sintaxis!==""){
                $salida=$this->consulta_a_array($resultado);
            }else{
                $arr_gasolineras=$this->consulta_a_array($resultado);
                $salida=array();
                $aux=0;
                foreach($arr_gasolineras as $gasolinera){
                    //$gasolinera["codigopostal"];
                    $municipio=$this->municipio_de_cp($gasolinera["codigopostal"]);
                    $arr_gasolineras[$aux]["municipio"]= $municipio['nombre'];
                    $arr_gasolineras[$aux]["estado"]=  $this->estado_de_municipio($municipio["id_municipio"]);
                    $aux++;
                }
                $salida=$arr_gasolineras;
            }
            return json_encode($salida);
        }elseif ($modo=="1") {
            $resultado=  $this->conexion->query($sql);
            $corrida=  mysqli_fetch_array($resultado);
            
            return $corrida[0];
        }
    }


    public function municipio_de_cp($id_cp) {//obtiuene el municipio donde se encuentra un Código postal
        $sql = "select id_municipio as municipio from cp where nombre='$id_cp'";
        $resultado = $this->conexion->query($sql);
        $corrida = mysqli_fetch_array($resultado);
        $sql="select id_municipio, nombre from municipio where id_municipio='$corrida[0]'";
        $resultado = $this->conexion->query($sql);
        $corrida = mysqli_fetch_array($resultado);
        return $corrida;
    }

    public function estado_de_municipio($id_municipio) {//En base de un id de municipio muestra a cuál estado pertenece
        $sql="select id_estado from municipio where id_municipio='$id_municipio'";
        $resultado = $this->conexion->query($sql);
        $corrida = mysqli_fetch_array($resultado);
        $estado=$corrida['id_estado'];        
        $sql = "select nombre from estado where id_estado='$estado'";
        $resultado = $this->conexion->query($sql);
        $corrida = mysqli_fetch_array($resultado);

        return $corrida[0];
    }

}
