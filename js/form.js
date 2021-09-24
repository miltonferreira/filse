// script para verificar se os campos não estão vazios -----------------------

var alertReturn = false;            // indica falta de preenchimento de campo
let alerts = null;                  // pega todos os alerts

// Pega os ID's do formulario
let title = null;
let urlPhoto = null;
let description = null;
let director = null;
let age = 0;

let timestamp, comment,  rating;

// Start grabbing our DOM Element
let submitBtn = null;

//let btnSub = null;  // indica qual é o botão de submit

function submitMovie(){

    // Pega os ID's do formulario
    title = document.querySelector('#title');
    urlPhoto = document.querySelector('#urlPhoto');
    description = document.querySelector('#description');
    director = document.querySelector('#director');
    age = document.querySelector('#age');

    //provisorio
    timestamp = document.querySelector('#timestamp');
    comment = document.querySelector('#comment');
    rating = document.querySelector('#rating');

    // Start grabbing our DOM Element
    submitBtn = document.querySelector('#submit');

    // pega todos os alerts
    alerts = document.querySelectorAll('.alert');

    alerts.forEach( aler => {
        aler.style = "display: none";   // esconde os alerts dos campos
    });

    // verifica se campos estão preenchidos ----------------------------------------------------------------
    alertReturn = checkForm(title, urlPhoto, description, director, age);

    if(alertReturn){
    
    } else {

        saveMovie(title.value, urlPhoto.value, description.value, director.value, age.value, 
            timestamp.value, comment.value, rating.value);

    }

}

// checa se os campos do formulario foram preenchidos -------------------------------
function checkForm(title, urlPhoto, description, director, age){

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
    director.value = "";
    age.value = "";
    // provisório------------------
    timestamp.value = "";
    comment.value = "";
    rating.value = "";
}

// formulario add novo filme -------------------------------------------------
function newMovie(){

    document.querySelector('#movies').innerHTML = '';   // limpa a lista de filmes

    let div = document.createElement('div');
    div.className = "movie";
    div.setAttribute("style", "padding: 5px;");

    div.innerHTML = `

        <div class="container mt-3 card card-body p-4">
            <div class="form-group">
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Ano</div>
                <label for="Message">Timestamp</label>
                <input id="timestamp" class="form-control" type="number" placeholder="Digite o tempo">
            </div>
            <div class="form-group">
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Ano</div>
                <label for="Message">Ano</label>
                <input id="age" class="form-control" type="number" placeholder="Digite o ano do filme">
            </div>
            <div class="form-group">
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Ano</div>
                <label for="Message">Comment</label>
                <input id="comment" class="form-control" type="text" placeholder="Digite o commentario">
            </div>
            <div class="form-group">
                <label for="Email">Descrição</label>
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Descrição</div>
                <textarea id="description" class="form-control" placeholder="Digite uma descrição"></textarea>
            </div>
            <div class="form-group">
                <label for="Message">Diretor</label>
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Diretor</div>
                <input id="director" class="form-control" type="text" placeholder="Digite o nome do diretor">
            </div>
            <div class="form-group">
                <label for="Name">URL de Foto</label>
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Foto</div>
                <input id="urlPhoto" class="form-control" type="text" placeholder="Digite um link de foto">
            </div>
            <div class="form-group">
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Ano</div>
                <label for="Message">Rating</label>
                <input id="rating" class="form-control" type="number" placeholder="Digite o rating">
            </div>
            <div class="form-group">
                <label for="Name">Titulo</label>
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Titulo</div>
                <input id="title" class="form-control" type="text" placeholder="Digite o nome do filme" >
            </div>
            <button id="submit" class="btn btn-primary" data-target="#saveModalCenter" onclick="submitMovie()">Enviar</button>
        </div>

    `;

    document.querySelector('#movies').append(div);

}

// salva o filme no firebase ----------------------------------------
function saveMovie(titleInput, urlPhotoInput, descriptionInput, directorInput, ageInput, 
    timestamp, comment, rating){

    var data = {
        added: parseInt(timestamp),
        title: titleInput,
        photo: urlPhotoInput,
        description: descriptionInput,
        director: directorInput,
        age: parseInt(ageInput),
        comment: comment, 
        rating: parseInt(rating),
        watched: true,
    };
    
    // salva o filme no firebase
    dbMovies.add(data).then(()=>{

        clearForm();                            // limpa formulario
        $('#saveModalCenter').modal('show');    // chama modal quando salva o filme
        
    }).catch((error)=>{
        console.log(error);
    });

}