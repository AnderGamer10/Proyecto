    /* ---------------------------------- Login -------------------------------------- */
window.enviarDatos = enviarDatos;
function enviarDatos(){
    window.location="main.html";
}
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
    /* ------------------------------- Fin Login ------------------------------------- */