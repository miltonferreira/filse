function addRatCom(){

    // ao clicar no botão ENVIAR envia infos para o firebase
    $("#btn-enviar").on("click", function(){ 
        
        rat = $("#recipient-name").val();
        com = $("#message-text").val();

        updateInfoMovie(rat, com);
        
        $('#exampleModal').modal('hide');   // fecha modal ao clicar no botao
    });

}

function setRatCom(rating, comment){

    $("#recipient-name").val(rating);
    $("#message-text").val(comment);

    // ao clicar no botão ENVIAR envia infos para o firebase
    $("#btn-enviar").on("click", function(){ 
        
        rat = $("#recipient-name").val();
        com = $("#message-text").val();

        updateInfoMovie(rat, com);
        
        $('#exampleModal').modal('hide');   // fecha modal ao clicar no botao
    });
    
}

// depois de salvar filme
//ao clicar no botão "Lista de Filmes" vai para pagina de Lista de Filmes
$("#btn-movie-list").on("click", function(){ 
        
    window.location.replace('movies.html');
    
    $('#exampleModal').modal('hide');   // fecha modal ao clicar no botao
});