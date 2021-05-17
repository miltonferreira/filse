// config firebase ------------------------------------------------------------------
connectFirebase();

var firestore = firebase.firestore();

var userLogin = null;   // recebe o dados do user vinda do firebase
var db = null;          // recebe lista de filmes do user
var dbw = null;         // recebe lista de filmes para adicionar
var userInfos = null;   // recebe infos do user
var userData = null;    // user

var movies = [];
var movieId;                                    // recebe ID do filme
var mouseup = false;                            // evita que envie várias vezes o update do filme

var moviesUser = 0;         // pega quantidade de filmes do user
var countMovies = 0;    // pega quantidade de filmes nao-vistos

// botoes
var btnLogout = document.getElementById('bt-exit');

// verifica o status do login do user
firebase.auth().onAuthStateChanged((user) => {
    if(user != null) {
        
        userLogin = user;

        userData = firestore.collection("Users").doc(userLogin.uid);

        db = userData.collection("viewedMovies");           // pega a coleção no firestore do user
        dbw = userData.collection("Movies");                // pega a colecao de filmes para adicionar
        
        userData.get().then(function(doc){
            if(doc.exists){
                moviesUser = doc.data().movies;             // pega quantidade de filmes do user
                countMovies = doc.data().countMovies;       // pega quantidade de filmes nao-vistos
                userInfos = doc.data();
                getInfoUser();

            } else {
                window.location.replace('index.html');
            }
        });    

        movieOrderByAdded("added", "desc");     // mostra lista dos filmes assistidos dos atuais aos antigos

    } else {
        window.location.replace('index.html');  // se nao tiver user logado vou para index.html
    }
});


// infos do user ----------------------------------------------------------
function getInfoUser(){
    document.querySelector('#user_data>p').innerHTML = `${userInfos.bio}`;
    document.querySelector('#avatar>img').setAttribute('src', userInfos.photo);
    document.querySelector('#user_data>h1').innerHTML = `${userInfos.name}`;
}

// mostra lista dos filmes assistidos -------------------------------------

function movieOrderByAdded(nameData, condition){
    document.querySelector('#movies').innerHTML = '';   // limpa a lista de filmes

    movies = [];                                        // limpa o array

    db.orderBy(nameData, condition).get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            addMovie(doc);
        });
        
    });
}

function addMovie(doc){
    var add = movies.push(doc.data());      // adiciona os dados do filme no array
    movies[add - 1].id = doc.id;            // adiciona o id do filme no array
    renderMovies(movies[add - 1]);          // renderiza o filme no html
}

// renderiza os cards dos filmes vistos
function renderMovies(movie) {

    let div = document.createElement('div');
    div.className = "movie";
    div.setAttribute("style", "padding: 5px;");

    div.innerHTML = `

            <div class="card mb-3 center_el" style="max-width: 940px;">
                <div class="row no-gutters">
                <div class="col-md-3">
                    <img style="max-width: 200px;" src="${movie.photo}" class="card-img" alt="...">
                </div>
                <div class="col-md-9">
                    <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <h6 class="card-text">Avalição: ${movie.rating}</h6>
                    <p class="card-text"><strong>Comentário:</strong> ${movie.comment}</p>
                    <p class="card-text-info"><small>Adicionado: ${convertToDate(movie.added)}</small></p>
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="setWatched('${movie.id}')">Editar</button>
                    </div>
                </div>
                </div>
            </div>

        `;

    document.querySelector('#movies').append(div);

}

function setWatched(id){    // botao para editar rating e comentario do filme
    
    movieId = id;           // pega id do filme
    mouseup = false;
    
    for(i = 0; i < movies.length; i++){ // procura o filme na lista
        if(movies[i].id == id){
            setRatCom(movies[i].rating, movies[i].comment);
        }
    }
}

function updateInfoMovie(rating, comment){  // atualiza filme no firebase
    var Ref = db.doc(movieId);
    
    var setWithMerge = Ref.set({
        added: updateTime(),
        comment: comment, 
        rating: rating,
        watched: true,
    }, { merge: true }).then(function() {
        // resposta ao conseguir modificar o valor
        
        if(mouseup == false){
            mouseup = true;     // evita que atualize mais de 1 vez
            movieOrderByAdded("added", "desc");     // mostra lista dos filmes assistidos dos atuais aos antigos
        }
        
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}

// controla lista filmes vistos ---------------------------------------------

 // botoes
 var btnMovies = document.getElementById('go-movies');
        
 btnMovies.addEventListener('click', function(){
     //window.location.replace('profile.html');
     movieOrderByAdded("added", "desc");     // mostra lista dos filmes assistidos dos atuais aos antigos
 });

// controla botao sobre -----------------------------------------------------

var btnAbout = document.getElementById('about');

btnAbout.addEventListener('click', function(){
    aboutUser();
});

function aboutUser(){
    document.querySelector('#movies').innerHTML = '';   // limpa a lista de filmes

    let div = document.createElement('div');
    div.className = "movie";
    div.setAttribute("style", "padding: 5px;");

    div.innerHTML = `

        <div id="movies" class="container-fluid">
            <div class="center_el" style="max-width: 940px;">
                <table class="table table-sm table-color">
                    <tbody>
                    <tr>
                        <th scope="row">Email</th>
                        <td>${userInfos.email}</td>
                    </tr>
                    <tr>
                        <th scope="row">Pais</th>
                        <td>${userInfos.country}</td>
                    </tr>
                    <tr>
                        <th scope="row">Filmes</th>
                        <td>${userInfos.movies}</td>
                    </tr>
                    <tr>
                        <th scope="row">Filmes Vistos</th>
                        <td>${userInfos.seenMovies}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

    `;

    document.querySelector('#movies').append(div);
}

// formulario add novo filme -------------------------------------------------

var btnAdd = document.getElementById('add-movie');

btnAdd.addEventListener('click', function(){
    newMovie();
});

function newMovie(){

    document.querySelector('#movies').innerHTML = '';   // limpa a lista de filmes

    let div = document.createElement('div');
    div.className = "movie";
    div.setAttribute("style", "padding: 5px;");

    div.innerHTML = `

        <div class="container mt-3 card card-body p-4">
            <div class="form-group">
                <label for="Name">Titulo</label>
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Titulo</div>
                <input id="title" class="form-control" type="text" placeholder="Digite o nome do filme" >
            </div>
            <div class="form-group">
                <label for="Name">URL de Foto</label>
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Foto</div>
                <input id="urlPhoto" class="form-control" type="text" placeholder="Digite um link de foto">
            </div>
            <div class="form-group">
                <label for="Email">Descrição</label>
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Descrição</div>
                <textarea id="description" class="form-control" placeholder="Digite uma descrição"></textarea>
            </div>
            <div class="form-group">
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Ano</div>
                <label for="Message">Ano</label>
                <input id="age" class="form-control" type="text" placeholder="Digite o ano do filme">
            </div>
            <div class="form-group">
                <label for="Message">Diretor</label>
                <div class="alert alert-danger" role="alert" style="display: none">Necessário preencher o campo Diretor</div>
                <input id="director" class="form-control" type="text" placeholder="Digite o nome do diretor">
            </div>
            <button id="submit" class="btn btn-primary" data-target="#saveModalCenter" onclick="submitMovie()">Enviar</button>
        </div>

    `;

    document.querySelector('#movies').append(div);

}

// salva o filme no firebase ----------------------------------------

function saveMovie(titleInput, urlPhotoInput, descriptionInput, ageInput, directorInput){

    userData.set({
        countMovies: (countMovies+1),       // +1 filme para ver
        movies: (moviesUser+1),             // +1 filme no total de filmes
    }, { merge: true }).then(function(){    // se user nao existir é criado na coleção User
        
        // Access the Database Collection
        dbw.doc().set({
            added: updateTime(),
            title: titleInput,
            photo: urlPhotoInput,
            description: descriptionInput,
            age: ageInput,
            director: directorInput,
            comment: null, 
            rating: 0,
            watched: false,
                
        }).then(function(){

            clearForm();                            // limpa formulario
            $('#saveModalCenter').modal('show');    // chama modal quando salva o filme
            

        }).catch(function(error){

            console.log(error);
                
        });

    });

    
}

// controla botao de logout --------------------------------------------------
btnLogout.addEventListener('click', function(){
    logout();
});

function logout(){

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

}