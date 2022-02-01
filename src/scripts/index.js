    /* ---------------------------------- Login -------------------------------------- */
window.enviarDatos = enviarDatos;
// function enviarDatos(){
//     window.location="main.html";
// }

function enviarDatos() {
    fetch("https://localhost:5001/Users/authenticate", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: document.getElementById("typeUsernameX").value,
          password: document.getElementById("typePasswordX").value,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => {
          console.log(err);
         });
}


// function enviarDatos(datos){
//     $.ajax({
//             data: datos,
//             url: "https://localhost:5001/Users/authenticate",
//             type: 'post',
//             success:  function (response) {
//                 console.log(response); // Imprimir respuesta del archivo
//             },
//             error: function (error) {
//                 console.log(error); // Imprimir respuesta de error
//             }
//     });
// }
    // $(document).ready(function () {
        // $("#btn-login").on("click", function () {
        //     var formData = $(form).serialize();
        //     console.log("prueba");
        //     $.post("https://localhost:5001/Users/authenticate", formData).done(function (result) {
        //         alert(result);
        //         console.log(result)
        //     })
        //     return true;
        // })
    // })
   
    /* ------------------------------- Fin Login ------------------------------------- */