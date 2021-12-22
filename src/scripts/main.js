import L from 'leaflet';

//mapa
var mymap = L.map('map').setView([43.29834714763016, -1.8620285690466898],11);

//"Comentarios" de la parte inferior derecha del mapa
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Mi portfolio &copy; <a href="http://10.10.17.1/2daw3/anderr/">Portafolio</a>',
maxZoom: 18
}).addTo(mymap);