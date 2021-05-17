// script para verificar se os campos não estão vazios -----------------------

var alertReturn = false;            // indica falta de preenchimento de campo
let alerts = null;                  // pega todos os alerts

// Pega os ID's do formulario
let title = null;
let urlPhoto = null;
let description = null;
let age = null;
let director = null;

// Start grabbing our DOM Element
let submitBtn = null;

function submitMovie(){

    // Pega os ID's do formulario
    title = document.querySelector('#title');
    urlPhoto = document.querySelector('#urlPhoto');
    description = document.querySelector('#description');
    age = document.querySelector('#age');
    director = document.querySelector('#director');

    // Start grabbing our DOM Element
    submitBtn = document.querySelector('#submit');

    // pega todos os alerts
    alerts = document.querySelectorAll('.alert');

    alerts.forEach( aler => {
        aler.style = "display: none";   // esconde os alerts dos campos
    });

    // salva infos do filme ----------------------------------------------------------------

    alertReturn = checkForm(title, urlPhoto, description, age, director);

    if(alertReturn){
    
    } else {

        saveMovie(title.value, urlPhoto.value, description.value, age.value, director.value);

    }

}

// checa se os campos do formulario foram preenchidos -------------------------------

function checkForm(title, urlPhoto, description, age, director){

    if(title.value == ""){
        alerts[0].style = "display: block";
        alertReturn = true;
    } else {
        alerts[0].style = "display: none";
    }

    if(urlPhoto.value == ""){
        alerts[1].style = "display: block";
        alertReturn = true;
    } else {
        alerts[1].style = "display: none";
    }

    if(description.value == ""){
        alerts[2].style = "display: block";
        alertReturn = true;
    } else {
        alerts[2].style = "display: none";
    }

    if(age.value == ""){
        alerts[3].style = "display: block";
        alertReturn = true;
    } else {
        alerts[3].style = "display: none";
    }

    if(director.value == ""){
        alerts[4].style = "display: block";
        alertReturn = true;
    } else {
        alerts[4].style = "display: none";
    }

    if(title.value != "" && urlPhoto.value != "" && description.value != "" && age.value != "" && director.value != ""){
        alertReturn = false;
    }

    return alertReturn;

}

// limpa os campos do formulario ---------------------------------------------

function clearForm(){
    title.value = "";
    urlPhoto.value = "";
    description.value = "";
    age.value = "";
    director.value = "";
}

function updateTime(){
    return Math.floor(new Date().getTime()/1000.0); // retorna o tempo
}