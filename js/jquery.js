// controla modal quando user add opinião sobre filme
function addRatCom(){

    // ao clicar no botão ENVIAR envia infos para o firebase
    $("#btn-enviar").on("click", function(){ 
        
        rat = $("#rate-field").val();
        com = $("#comment-field").val();

        updateInfoMovie(rat, com);

        clearFields();                      // limpa formulario
        
        $('#exampleModal').modal('hide');   // fecha modal ao clicar no botao
    });

}

// controla modal quando user edita opinião sobre filme
function setRatCom(rating, comment){

    $("#rate-field").val(rating);
    $("#comment-field").val(comment);

    // ao clicar no botão ENVIAR envia infos para o firebase
    $("#btn-enviar").on("click", function(){ 
        
        rat = $("#rate-field").val();
        com = $("#comment-field").val();

        updateInfoMovie(rat, com);

        clearFields();                      // limpa formulario
        
        $('#exampleModal').modal('hide');   // fecha modal ao clicar no botao
    });
    
}

function clearFields(){
    $("#rate-field").val('');
    $("#comment-field").val('');
}

// depois de salvar filme
// ao clicar no botão "Lista de Filmes" vai para pagina de Lista de Filmes
$("#btn-movie-list").on("click", function(){ 
        
    window.location.replace('movies.html');
    
    $('#exampleModal').modal('hide');   // fecha modal ao clicar no botao
});