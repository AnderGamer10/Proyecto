import L from 'leaflet';

//mapa
var mapa = L.map('map').setView([43.29834714763016, -1.8620285690466898],11);

//"Comentarios" de la parte inferior derecha del mapa
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Mi portfolio &copy; <a href="http://185.60.40.210/2daw3/anderr/">Portafolio</a>',
maxZoom: 18
}).addTo(mapa);

var aDatos = JSON.parse(sDatos);

crearNodos();

//Funcion para crear los nodos 
function crearNodos(){
    for(i = 0; i < aDatos.length;i++){
        var marker = L.marker([aDatos[i].GpxY, aDatos[i].GpxX]).addTo(mapa);
        marker.bindPopup(`${aDatos[i].Nombre}`);    
    }
};