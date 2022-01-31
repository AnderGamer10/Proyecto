import { map } from 'jquery';
import L from 'leaflet';

//mapa
const mapa = L.map('map').setView([43.29834714763016, -1.8620285690466898], 11);

//"Comentarios" de la parte inferior derecha del mapa
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="http://185.60.40.210/2daw3/anderr/">Mi portfolio</a> &copy; ',
    maxZoom: 18
}).addTo(mapa);

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

function obteniendoDatos() {
    fetch("https://localhost:5001/api/InformacionTiempoes")
        .then(response => response.json())
        .then(aDatos => {
            console.log(aDatos);

            //Funcion para crear los marcadores y el localStorage
            function crearMarcadores() {
                if (localStorage.IDs == null)
                    localStorage.IDs = JSON.stringify(aSeleccionados);
                for (let i = 0; i < aDatos.length; i++) {
                    let sMarker = L.marker([aDatos[i].gpxY, aDatos[i].gpxX], { myId: aDatos[i].id }).bindPopup(`${aDatos[i].nombre}`).addTo(mapa);
                    sMarker.on("click", añadirSeleccionado);
                    popUpOverOut(sMarker);
                    aMarcadores.push(sMarker);
                }
            };

            //Funcion para saber que marcador a clicado
            function añadirSeleccionado(e) {
                var sObtenerNombre = e.target.getPopup().getContent();
                for (let i = 0; i < aDatos.length; i++) {
                    if (aDatos[i].nombre == sObtenerNombre) {
                        let sId = aDatos[i].id;
                        //Se añadira a un array para saber si esta seleccionado 
                        if (aSeleccionados.indexOf(sId) == -1 && aSeleccionados.length < 4) {
                            aMarcadores[i].setIcon(redIcon);
                            aSeleccionados.push(sId);
                            localStorage.IDs = JSON.stringify(aSeleccionados);
                            crearSeleccionado(sId, aDatos);
                            borrarSeleccionada(aDatos);
                            activarDroppable();
                        }
                        break;
                    }
                }
            }

            //Funcion para crear los filtros
            function selectsFiltro() {
                let selecccionEstacion = `<select id="selEstacion" name="Estaciones">
                <option value="none">Estaciones</option>
                <option value="BUOY">Plataformas</option>
                <option value="METEOROLOGICAL">Meteorologico</option>
                <option value="GAUGING">De aforo</option>
                <option value="QUALITY">De calidad</option>
                </select>
                `;
                let selecccionProvincia = `<select id="selProvincia" name="Provincias">
                <option value="none">Provincias</option>
                <option value="Bizkaia">Bizkaia</option>
                <option value="Gipuzkoa">Gipuzkoa</option>
                <option value="Álava">Álava</option>
                <option value="Burgos">Burgos</option>
                <option value="Navarra">Navarra</option>
                </select>
                `;
                $("#filtro").append(selecccionEstacion);
                $("#filtro").append(selecccionProvincia);

                $("select").on("change", function () {
                    let cambioEstaciones = document.getElementById("selEstacion").value;
                    let cambioProvincias = document.getElementById("selProvincia").value;

                    //Eliminamos del mapa los markers para añadirlo de nuevo segun el filtro
                    aMarcadores.forEach(i => {
                        mapa.removeLayer(i);
                    });
                    aMarcadores = [];

                    //If else para saber la seleccion de filtro
                    if (cambioEstaciones == "none" && cambioProvincias == "none") {
                        crearMarcadores();
                    } else if (cambioEstaciones == "none" && cambioProvincias != "none") {
                        for (let i = 0; i < aDatos.length; i++) {
                            if (aDatos[i].provincia == cambioProvincias) {
                                añadirMakerAMapa(i);
                            } else {
                                añadirMarkerArray(i);
                            }
                        }
                    } else if (cambioEstaciones != "none" && cambioProvincias == "none") {
                        for (let i = 0; i < aDatos.length; i++) {
                            if (aDatos[i].tipoEstacion == cambioEstaciones) {
                                añadirMakerAMapa(i);
                            } else {
                                añadirMarkerArray(i);
                            }
                        }
                    } else {
                        for (let i = 0; i < aDatos.length; i++) {
                            if (aDatos[i].provincia == cambioProvincias && aDatos[i].tipoEstacion == cambioEstaciones) {
                                añadirMakerAMapa(i);
                            } else {
                                añadirMarkerArray(i);
                            }
                        }
                    }
                    colorearSeleccionados();

                });
            }

            //Dos Funciones para añadir al array de marcadores los markers y añadir al mapa los elegidos
            function añadirMakerAMapa(i) {
                let sMarker = L.marker([aDatos[i].gpxY, aDatos[i].gpxX], { myId: aDatos[i].id }).bindPopup(`${aDatos[i].nombre}`).addTo(mapa);
                sMarker.on("click", añadirSeleccionado);
                popUpOverOut(sMarker);
                aMarcadores.push(sMarker);
            }
            function añadirMarkerArray(i) {
                let sMarker = L.marker([aDatos[i].gpxY, aDatos[i].gpxX], { myId: aDatos[i].id }).bindPopup(`${aDatos[i].nombre}`);
                popUpOverOut(sMarker);
                aMarcadores.push(sMarker);
            }
            //Funcion para mostrar el popup y dejarlo de mostrar al estar encima de un marcador
            function popUpOverOut(sMarker) {
                sMarker.on("mouseover", function (e) {
                    this.openPopup();
                });

                sMarker.on("mouseout", function (e) {
                    this.closePopup();
                });
            }

            //Llamada de functions
            crearMarcadores();
            almacenadosLocalStorage(aDatos);
            selectsFiltro();
        })
};

//Se añade al html el seleccionado
function crearSeleccionado(sId, aDatos) {
    for (let i = 0; i < aDatos.length; i++) {
        if (aDatos[i].id == sId) {
            let sCrearDiv =
                `
            <div id="${sId}" class="opcionElegida ">
                <div id="elegida-info" class="d-flex flex-row">
                    <h3>${aDatos[i].nombre}</h3>
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
                <div class="informacion-cuadrado mostrar-info" id="divTemperature">
                    <p>Temperatura:</p>
                    <b><p>${aDatos[i].temperatura} &deg;C</p></b>
                </div>
                <div class="informacion-cuadrado mostrar-info" id="divHumidity">
                    <p>Humedad:</p>
                    <b><p>${aDatos[i].humedad}%</p></b>
                </div>
                <div class="informacion-cuadrado" id="divWind">
                    <p>Viento:</p>
                    <b><p>${aDatos[i].velocidadViento} km/h</p></b>
                </div>
                <div class="informacion-cuadrado" id="divRaining">
                    <p>Precipitacion:</p>
                    <b><p>${aDatos[i].precipitacionAcumulada} mm=l/m²</p></b>
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
                    aMarcadores[j].setIcon(redIcon);
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

//Funcion para colorear los marcadores seleccionados al filtrar
function colorearSeleccionados() {
    for (let i = 0; i < aMarcadores.length; i++) {
        for (let j = 0; j < aSeleccionados.length; j++) {
            if (aSeleccionados[j] == aMarcadores[i].options.myId) {
                aMarcadores[i].setIcon(redIcon);
            }
        }
    }
}

//Activamos el draggable en las imagenes de las opciones
$(function () {
    $("#imgTemperature").draggable({ revert: true });
    $("#imgHumidity").draggable({ revert: true });
    $("#imgWind").draggable({ revert: true });
    $("#imgRaining").draggable({ revert: true });
});

//Escondemos el contenido de la informacion
$(document).ready(function () {
    //SlideToggle y slideUp para la informacion
    $("#container-datos1").on("click", function () {
        $("#contenido1").slideToggle(1000);
        cambioTamanoInformacion();

        $("#contenido2").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos2").on("click", function () {
        $("#contenido2").slideToggle(1000);
        cambioTamanoInformacion();

        $("#contenido1").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos3").on("click", function () {
        $("#contenido3").slideToggle(1000);
        cambioTamanoInformacion();

        $("#contenido2").slideUp(1000);
        $("#contenido1").slideUp(1000);
        $("#contenido4").slideUp(1000);
    });
    $("#container-datos4").on("click", function () {
        $("#contenido4").slideToggle(1000);
        cambioTamanoInformacion();

        $("#contenido2").slideUp(1000);
        $("#contenido3").slideUp(1000);
        $("#contenido1").slideUp(1000);
    });

    //Para minimizar el mapa
    $("#mini-map").on("click", function () {
        $("#map-info").slideToggle(1000);
    });
});

//Sirve para aumentar el tamaño del div de informacion para que no se quede fuera
function cambioTamanoInformacion() {
    if ($("#informacion").height() != 300)
        $("#informacion").animate({ height: 300 }, 1000);
    else
        $("#informacion").animate({ height: 520 }, 1000);
}

obteniendoDatos();