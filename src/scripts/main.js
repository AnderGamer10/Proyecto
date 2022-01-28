import L from 'leaflet';

//mapa
const mapa = L.map('map').setView([43.29834714763016, -1.8620285690466898], 11);

//"Comentarios" de la parte inferior derecha del mapa
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Mi portfolio &copy; <a href="http://185.60.40.210/2daw3/anderr/">Portafolio</a>',
    maxZoom: 18
}).addTo(mapa);

/* ---------------------------------------------------------------------Haciendo--------------------------------------------------------------------- */
function obteniendoDatos() {
    fetch("https://localhost:5001/api/InformacionTiempoes")
        .then(response => response.json())
        .then(datosTiempo => {
            console.log(datosTiempo);
            crearMarcadores(datosTiempo);
            almacenadosLocalStorage(datosTiempo);
        })
};
obteniendoDatos();
/* ----------------------------------------------------------------- Fin de Haciendo ------------------------------------------------------------------ */


//Parseo de datos json var aDatos = JSON.parse(sDatos);


//Marcadores seleccionados
aSeleccionados = [];

//Todos los marcadores
aMarcadores = [];

//Variables para cambiar el color de los marcadores
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



//Funcion para crear los nodos 
function crearMarcadores(aDatos) {
    console.log(aDatos[5].nombre)
    for (let i = 0; i < aDatos.length; i++) {
        let marker = L.marker([aDatos[i].gpxY, aDatos[i].gpxX], { myId: aDatos[i].id}).bindPopup(`${aDatos[i].nombre}`).addTo(mapa);
        marker.on("click", añadirSeleccionado(aDatos[i].nombre,aDatos));
        aMarcadores.push(marker);
    }
};

//Funcion para saber que marcador a clicado
function añadirSeleccionado(nombre,aDatos) {
    for (let i = 0; i < aDatos.length; i++) {
        if(aDatos[i].nombre == nombre){
            let sId = aDatos[i].id;
            //Se añadira a un array para saber si esta seleccionado 
            if (aSeleccionados.indexOf(sId) == -1 && aSeleccionados.length < 4) {
                
                /* ahora va mal el seticon --------------------------------------------------------------------*/ 
                aMarcadores[i].setIcon(redIcon);
                aSeleccionados.push(sId);
                localStorage.IDs = JSON.stringify(aSeleccionados);
                crearSeleccionado(aDatos[i].id, aDatos);
                borrarSeleccionada(aDatos);
                activarDroppable();
            }
            break;
        }
    }
}

//Se añade al html el seleccionado
function crearSeleccionado(sId, aDatos) {
    for (let i = 0; i < aDatos.length; i++) {
        if (aDatos[i].id == sId) {
            let sCrearDiv =
                `
            <div id="${sId}" class="opcionElegida">
                <div id="elegida-info" class="d-flex flex-row">
                    <h3>${aDatos[i].nombre}</h3>
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
                <div class="informacion-cuadrado mostrar-info" id="divTemperature">
                    <p>Temperatura:</p>
                    <b><p>20&deg;C</p></b>
                </div>
                <div class="informacion-cuadrado" id="divHumidity">
                    <p>Humedad:</p>
                    <b><p>1</p></b>
                </div>
                <div class="informacion-cuadrado" id="divWind">
                    <p>Viento:</p>
                    <b><p>4</p></b>
                </div>
                <div class="informacion-cuadrado" id="divRaining">
                    <p>Precipitacion:</p>
                    <b><p>0</p></b>
                </div>
            </div>
            `;
            document.getElementById("seleccionados").innerHTML += sCrearDiv;
        }

    }
}

//Obtenemos datos de los almacenados
function almacenadosLocalStorage(aDatos) {
    if (localStorage.length != null) {
        aAñadirArray = JSON.parse(localStorage.IDs);
        for (let i = 0; i < aAñadirArray.length; i++) {
            for (let j = 0; j < aDatos.length; j++) {
                if (aMarcadores[j].options.myId == aAñadirArray[i]) {
                    aMarcadores[j].setIcon(redIcon)
                }
            }
            aSeleccionados.push(aAñadirArray[i]);
            crearSeleccionado(aAñadirArray[i], aDatos);
        }
        borrarSeleccionada(aDatos);
        activarDroppable();
    }
}

//Borramos el seleccionado
function borrarSeleccionada(aDatos) {
    $(".btn-close").on("click", function () {
        //Obtenemos el id y posicion del id en seleccionados
        console.log("1");
        let sId = this.closest(".opcionElegida").id;
        let sIdx = aSeleccionados.indexOf(sId);
        if (sIdx != -1)
            aSeleccionados.splice(sIdx, 1);
        //Borramos del local storage
        for (let i = 0; i < aDatos.length; i++) {
            if (aDatos[i].id == sId) {
                localStorage.IDs = JSON.stringify(aSeleccionados);
                aMarcadores[i].setIcon(blueIcon);
                break;
            }
        }
        $(this).closest(".opcionElegida").remove();
    });
}

//Activamos el droppable
function activarDroppable() {
    //Activamos el droppable de las opciones elegidas
    $(".opcionElegida").droppable({
        classes: {
            "ui-droppable-active": "ui-state-highlight",
            "ui-droppable-hover": "ui-state-hover"
        },
        drop: function (event, ui) {
            let sId = ui.draggable.attr("id").substring(3)
            $(this).find(`#div${sId}`).addClass("mostrar-info");
        }
    });
}

//Activamos el draggable en las imagenes de las opciones
$(function () {
    //$("#seleccionados").sortable();
    $("#imgTemperature").draggable({ revert: true });
    $("#imgHumidity").draggable({ revert: true });
    $("#imgWind").draggable({ revert: true });
    $("#imgRaining").draggable({ revert: true });
});

//Escondemos el contenido de la informacion
$(".contenido").hide();
//slide toggle para el ejercicio
$(document).ready(function () {
    $("#container-datos1").click(function () {
        $("#contenido1").slideToggle(1000);

        $("#contenido2").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos2").click(function () {
        $("#contenido2").slideToggle(1000);

        $("#contenido1").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos3").click(function () {
        $("#contenido3").slideToggle(1000);

        $("#contenido2").slideUp(1000);
        $("#contenido1").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos4").click(function () {
        $("#contenido4").slideToggle(1000);

        $("#contenido2").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido1").slideUp(1000);
    });
});

//Funciona para minimizar el mapa
$(document).ready(function () {
    $("#mini-map").click(function () {
        $("#map").slideToggle(1000);
        $("#info-selec-marc").slideToggle(1000);
    });
});

