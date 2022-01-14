import L from 'leaflet';

//mapa
const mapa = L.map('map').setView([43.29834714763016, -1.8620285690466898],11);

//"Comentarios" de la parte inferior derecha del mapa
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Mi portfolio &copy; <a href="http://185.60.40.210/2daw3/anderr/">Portafolio</a>',
maxZoom: 18
}).addTo(mapa);
//Marcadores seleccionados
seleccionados = [];

var aDatos = JSON.parse(sDatos);

//Variable para cambiar el color de los marcadores
var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

crearNodos();

//Funcion para crear los nodos 
function crearNodos(){
    for(i = 0; i < aDatos.length;i++){
        let marker = L.marker([aDatos[i].GpxY, aDatos[i].GpxX]).addTo(mapa);
        marker.bindPopup(`${aDatos[i].Nombre}`);   

        marker.on("click", añadir);
        
    }
};

//Funcion para saber que marcador a clicado
function añadir(e) {
    let sValorNombre = e.target.getPopup().getContent();
    /*-----------  Por hacer -----------
    En esta funcion se obtendra los valores de la temperatura
    */ 
    for(let i = 0; i < aDatos.length;i++){
        if(sValorNombre == aDatos[i].Nombre){
            id = aDatos[i].Id;
            //Se añadira a un array para saber si esta dentro o no
            if(seleccionados.indexOf(id) == -1 && seleccionados.length < 4){
                e.target.setIcon(redIcon);
                seleccionados.push(id);
                let crearDiv = "";
                crearDiv += 
                `
                <div id="opcion${id}" class="opcionElegida">
                    <div id="elegida-info">
                        <p>${aDatos[i].Nombre}</p>
                    </div>
                </div>
                `;
                document.getElementById("seleccionados").innerHTML += crearDiv;
            }
            break;
        }
    }

    //Activamos el droppable de las opciones elegidas
    $(".opcionElegida").droppable({
        classes: {
            "ui-droppable-active": "ui-state-highlight",
            "ui-droppable-hover": "ui-state-hover"
          },
        drop: function(event,ui){
            $(this)
            .find( "p" )
              .html( "Dropped!" );
        }
    })
    console.log(id);
};

//Activamos el draggable en las imagenes de las opciones
$(function(){
    $("#temperature").draggable({ revert: true });
    $("#humidity").draggable({ revert: true });
    $("#wind").draggable({ revert: true });
    $("#raining").draggable({ revert: true });
});




$(".contenido").hide();
//slide toggle para el ejercicio
$(document).ready(function () {
    $("#container-datos1").click(function(){
        $("#contenido1").slideToggle(1000);
        
        $("#contenido2").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos2").click(function(){
        $("#contenido2").slideToggle(1000);

        $("#contenido1").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos3").click(function(){
        $("#contenido3").slideToggle(1000);

        $("#contenido2").slideUp(1000);
        $("#contenido1").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos4").click(function(){
        $("#contenido4").slideToggle(1000);

        $("#contenido2").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido1").slideUp(1000);
    });
});