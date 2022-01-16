import L from 'leaflet';
import { marker } from 'leaflet';

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

var blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
crearNodos();
almacenados();

//Funcion para crear los nodos 
function crearNodos(){
    for(let i = 0; i < aDatos.length;i++){
        let marker = L.marker([aDatos[i].GpxY, aDatos[i].GpxX], {myId: aDatos[i].Id}).bindPopup(`${aDatos[i].Nombre}`).addTo(mapa); 
        marker.on("click", añadir);
    }
};

//Funcion para saber que marcador a clicado
function añadir(e) {
    let sValorNombre = e.target.getPopup().getContent();
    for(let i = 0; i < aDatos.length;i++){
        if(sValorNombre == aDatos[i].Nombre){
            id = aDatos[i].Id;
            //Se añadira a un array para saber si esta seleccionado 
            if(seleccionados.indexOf(id) == -1 && seleccionados.length < 4){
                localStorage.setItem(`${aDatos[i].Nombre}`, aDatos[i].Id)
                e.target.setIcon(redIcon);
                seleccionados.push(id);
                crearSeleccionado(aDatos[i].Id);
            }
            break;
        }
    }
    console.log(id);
}

function almacenados(){
    if(localStorage.length != null){
        var valor = [],
        keys = Object.keys(localStorage);

        for(let i = 0; i < localStorage.length;i++){
            let valorId = localStorage.getItem(keys[i]);
            seleccionados.push(valorId);
            crearSeleccionado(valorId);
        }
    }
}

function crearSeleccionado(id){
    for(let i = 0; i < aDatos.length;i++){
        if(aDatos[i].Id == id){
            let crearDiv = 
            `
            <div id="${id}" class="opcionElegida">
                <div id="elegida-info">
                    <p>${aDatos[i].Nombre}</p>
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
            </div>
            `;
            document.getElementById("seleccionados").innerHTML += crearDiv;
        }
        
    } 
}

//Borramos el seleccionado ----------------------Borrado de local storage por hacer
$(".btn-close").click(function(e){
    //Obtenemos el id y posicion del id en seleccionados
    let id = e.target.closest(".opcionElegida").id;
    let idx = seleccionados.indexOf(id);
    if(idx != -1)
        seleccionados.splice(idx,1);

    //Borramos del local storage
    for(let i = 0; i < aDatos.length;i++){
        if(aDatos[i].Id == id){
            localStorage.removeItem(`${aDatos[i].Nombre}`);
        }
    }
    $(this).closest(".opcionElegida").remove();
});


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
});


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