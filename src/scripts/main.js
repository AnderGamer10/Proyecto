import L from 'leaflet';

//mapa
const mapa = L.map('map').setView([43.29834714763016, -1.8620285690466898], 11);

//"Comentarios" de la parte inferior derecha del mapa
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Mi portfolio &copy; <a href="http://185.60.40.210/2daw3/anderr/">Portafolio</a>',
    maxZoom: 18
}).addTo(mapa);

//Marcadores seleccionados
seleccionados = [];

//Todos los marcadores
marcadores = [];
var aDatos = JSON.parse(sDatos);

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

crearMarcadores();
almacenadosLocalStorage();

//Funcion para crear los nodos 
function crearMarcadores() {
    for (let i = 0; i < aDatos.length; i++) {
        let marker = L.marker([aDatos[i].GpxY, aDatos[i].GpxX], { myId: aDatos[i].Id }).bindPopup(`${aDatos[i].Nombre}`).addTo(mapa);
        marker.on("click", añadirSeleccionado);
        marcadores.push(marker);
    }
};

//Funcion para saber que marcador a clicado
function añadirSeleccionado(e) {
    let sValorNombre = e.target.getPopup().getContent();
    for (let i = 0; i < aDatos.length; i++) {
        if (sValorNombre == aDatos[i].Nombre) {
            id = aDatos[i].Id;
            //Se añadira a un array para saber si esta seleccionado 
            if (seleccionados.indexOf(id) == -1 && seleccionados.length < 4) {
                localStorage.setItem(`${aDatos[i].Nombre}`, aDatos[i].Id)
                e.target.setIcon(redIcon);
                seleccionados.push(id);
                crearSeleccionado(aDatos[i].Id);
                borrarSeleccionada();
                activarDroppable();
            }
            break;
        }
    }
    console.log(id);
}

//Se añade al html el seleccionado
function crearSeleccionado(id) {
    for (let i = 0; i < aDatos.length; i++) {
        if (aDatos[i].Id == id) {
            let crearDiv =
                `
            <div id="${id}" class="opcionElegida">
                <div id="elegida-info">
                    <h3>${aDatos[i].Nombre}</h3>
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
            document.getElementById("seleccionados").innerHTML += crearDiv;
        }

    }
}

//Obtenemos datos de los almacenados
function almacenadosLocalStorage() {
    if (localStorage.length != null) {
        var valor = [],
            keys = Object.keys(localStorage);
        for (let i = 0; i < localStorage.length; i++) {
            let valorId = localStorage.getItem(keys[i]);
            seleccionados.push(valorId);
            for (let i = 0; i < aDatos.length; i++) {
                if (marcadores[i].options.myId == valorId) {
                    marcadores[i].setIcon(redIcon)
                }
            }
            crearSeleccionado(valorId);
            borrarSeleccionada();
            activarDroppable();
        }
    }
}

//Borramos el seleccionado
function borrarSeleccionada() {
    $(".btn-close").on("click", function () {
        //Obtenemos el id y posicion del id en seleccionados
        console.log("1");
        let id = this.closest(".opcionElegida").id;
        let idx = seleccionados.indexOf(id);
        if (idx != -1)
            seleccionados.splice(idx, 1);
        //Borramos del local storage
        for (let i = 0; i < aDatos.length; i++) {
            if (aDatos[i].Id == id) {
                localStorage.removeItem(`${aDatos[i].Nombre}`);
                marcadores[i].setIcon(blueIcon);
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
            let id = ui.draggable.attr("id").substring(3)
            $(this).find(`#div${id}`).addClass("mostrar-info");
        }
    });
}

//Activamos el draggable en las imagenes de las opciones
$(function () {
    $("#seleccionados").sortable();
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