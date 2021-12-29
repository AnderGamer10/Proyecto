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
        marker.on("click", añadir);
    }
};
seleccionados = [];
//Funcion para saber que marcador a clicado
function añadir(e) {
    var sValorNombre = e.target.getPopup().getContent();
    /*-----------  Por hacer -----------
    En esta funcion se obtendra los valores de la temperatura
    */ 
    for(i = 0; i < aDatos.length;i++){
        if(sValorNombre == aDatos[i].Nombre){
            id = aDatos[i].Id;
            //Se añadira a un array para saber si esta dentro o no
            if(seleccionados.indexOf(id) == -1 && seleccionados.length < 5){
                seleccionados.push(id);
                var crearDiv = "";
                crearDiv += 
                `
                <div id="opcion${id}" class="opcionElegida">
                    <p>${aDatos[i].Nombre}</p>
                </div>
                `;
                document.getElementById("seleccionados").innerHTML += crearDiv;
            }else{
                //Mejorar la alerta--------------------------------------------------
                alert("No se puede añadir ya que ha superado la cantidad de lugares seleccionados o ya la ha seleccionado")
            }
            break;
        }
    }

    console.log(id);
};