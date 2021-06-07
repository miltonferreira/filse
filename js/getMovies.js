// config firebase ------------------------------------------------------------------
connectFirebase();

var firestore = firebase.firestore();

var userLogin = null;   // recebe o dados do user vinda do firebase *** remover no futuro
var userData = null;    // user
var db = null;          // recebe coleçao de filmes do user
var dbw = null          // recebe colecao de filmes vistos do user

// paginacao -----------------------------------------------------------
// botoes de anterior e proximo

var btnPrev = document.querySelector('#prev');
var btnNext = document.querySelector('#next');

var btNext = false;     // evita que tenha interação mesmo com botao desativado

var prev = [];          // volta na paginacao
var prevPos = 0;        // indica quantas vezes pode volta
var last = null;        // pega o ultimo filme da lista
var count = 2;          // quantidade de filmes por pagina

var descName = null;    // tipo de ordenação dos filmes, adicionado ou por ano
var orderName = null;   // tipo de ordenação de Decrescente(atual>antigo) ou Crescente(antigo>atual)

var isNext = false;     // indica que usou paginacao

// conta a quantidade de filmes por pagina ----------------------------

var countMovies = 0;    // pega quantidade de filmes nao-vistos
var seenMovies = 0      // pega quantidade de filmes vistos
var totalMovies = 0;    // soma os filmes por paginacao quando avança com botao next
var moviesPerPage = 0;  // pega quantos filmes a pagina carregou para controlar na paginacao

// verifica se esta logado -------------------------------------------
firebase.auth().onAuthStateChanged((user) => {
    if(user != null) {

        userLogin = user;

        userData = firestore.collection("Users").doc(userLogin.uid);
                
        db = userData.collection("Movies");             // pega a coleção no firestore do user
        dbw = userData.collection("viewedMovies");      // recebe colecao de filmes vistos do user

        userData.get().then(function(doc){
            if(doc.exists){
                countMovies = doc.data().countMovies;   // quantidade de filmes nao-vistos
                seenMovies = doc.data().seenMovies;     // quantidade de filmes vistos
                renderAvatar(doc.data().photo);         // adiciona a foto do user

            } else {
                window.location.replace('index.html');  // se nao tiver o user na lista de user's, volta para index.html
            }
        });    

        dataDesc();  // mostra adicionados dos atuais aos antigos
        
    } else {
        window.location.replace('index.html');  // se nao tiver user logado vou para index.html
    }
});

// add foto do user na barra superior direita
function renderAvatar(img){
    let oImg = document.createElement('img');
    oImg.setAttribute('src', img);
    oImg.setAttribute('alt', 'avatar');
    oImg.className = "profile-pic";
    document.querySelector('#avatar').append(oImg);
}

// botão de logout
var btnLogout = document.getElementById('bt-exit');

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


// dados dos filmes --------------------------------------------------------------------------------------------------------

var movies = [];
var movieId;                                    // recebe ID do filme
var mouseup = false;                            // evita que envie várias vezes o update do filme

// Recebendo um documento -----------------------------------------------

// função não usada
function moviesAll() {
    db.get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
        console.log(doc.id, "=>", doc.data());
        })
    });
}
// função não usada
function moviesWhere(data1, op, data2) {
    db.where(data1, op, data2).get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
        console.log(doc.id, "=>", doc.data());
        })
    });
}

// quando troca ordenação dos filmes, reseta tudo
function resetPag(){
    isNext = false;                          // indica que pode usar paginacao
    totalMovies = 0;
    prevPos = 0;
    last = null;
    prev = [];

    paginationNext();
}

// mostra lista dos filmes adicionados mais atuais
function dataDesc(){
    
    descName = "added";
    orderName = "desc";

    resetPag();
    
}

// mostra lista dos filmes adicionados dos antigos aos atuais
function dataAsc(){

    descName = "added";
    orderName = "asc";

    resetPag();
}

// mostra lista dos filmes por ano
function movieAgeDesc(){

    descName = "age";
    orderName = "desc";

    resetPag();
}

// functions para controlar prev e next ---------------------------

// ouvinte do botao de avançar
btnNext.addEventListener('click', function(){
    if(totalMovies < countMovies)   // verifica se não chegou no final
    paginationNext();
});

// ouvinte do botao de volta
btnPrev.addEventListener('click', function(){
    if(prev.length > 1) // verifica se não chegou no começo
    paginationPrev();
});

// função para limpar a pagina e recebe nova lista de filmes
function clearPage(){
    document.querySelector('#movies').innerHTML = '';   // limpa a lista de filmes
    movies = [];                                        // limpa o array
}

// recebe a lista de filmes do user
function listMovies(docSnapshots){
    docSnapshots.forEach(function(doc){
        var add = movies.push(doc.data());      // adiciona os dados do filme no array
        movies[add - 1].id = doc.id;            // adiciona o id do filme no array
        renderMovies(movies[add - 1]);          // renderiza o filme na lista do html
    });
}

// função de paginação para avançar lista de filmes
function paginationNext(){
    // se for a primeira vez que carrega a lista de filmes cai nessa condição
    if(isNext == false){

        let first = db.orderBy(descName, orderName).limit(count);       // ordena conforme condição das 3 variaveis

            first.get().then((docSnapshots) => {
                
                clearPage();                                            // limpar a pagina e recebe nova lista de filmes

                if(docSnapshots.size > 0){
                    totalMovies += docSnapshots.docs.length;            // soma a quantidade de filmes carregados
                    moviesPerPage = docSnapshots.docs.length;           // pega a quantidade de filmes carregados para decrementar na volta de página
                }

                prev.push(docSnapshots.docs[0]);                        // pega o primeiro filme da lista
                last = docSnapshots.docs[docSnapshots.docs.length-1];   // pega o ultimo filme da lista

                listMovies(docSnapshots);                               // envia lista dos filmes para renderizar
                search();                                               // pesquisa pelo nome
                
                isNext = true;                                          // indica que usou paginacao
                nextActive();                                           // ativa botao de next
                Prevdisabled();                                         // desativa botao de volta

        });

    } else {
        
        // começa ordenação baseado no ultimo filme da lista anterior
        let first = db.orderBy(descName, orderName).startAfter(last).limit(count);

            first.get().then((docSnapshots) => {

                // se for ultima pagina nao vai executa codigo abaixo pois não vem filme na lista
                if(docSnapshots.size > 0)

                    totalMovies += docSnapshots.docs.length;                // soma a quantidade de filmes carregados
                    moviesPerPage = docSnapshots.docs.length;               // pega a quantidade de filmes carregados para decrementar na volta de página
                    
                    clearPage();                                            // limpar a pagina e recebe nova lista de filmes

                    prev.push(docSnapshots.docs[0]);                        // pega o primeiro filme da lista
                    last = docSnapshots.docs[docSnapshots.docs.length-1];   // pega a quantidade de filmes carregados para decrementar na volta de página

                    listMovies(docSnapshots);                               // envia lista dos filmes para renderizar

                    search();                                               // pesquisa pelo nome
                    prevPos += 1;                                           // indica quantas vezes pode volta

                    // verifica se os filmes carregados é => que os quantidade TOTAL de filmes não-vistos do user
                    if(totalMovies >= countMovies){                          
                        nextDisabled();                                     // desativa botao de next caso seja TRUE
                    } else {
                        nextActive();                                       // ativa botao de next caso seja FALSE
                    }
        
                    PrevActive();                                           // ativa botão de volta, já que existe lista anteriores
                
        });

    }

}

function paginationPrev(){

    var first = db.orderBy(descName, orderName).startAt(prev[prevPos - 1]).limit(count);

            first.get().then((docSnapshots) => {

                // se for ultima pagina nao vai executa codigo abaixo
                if(docSnapshots.size > 0)

                    totalMovies -= moviesPerPage;
                    nextActive();               // ativa botao de next
                    
                    clearPage();
  
                    last = docSnapshots.docs[docSnapshots.docs.length-1];
                    moviesPerPage = docSnapshots.docs.length;

                    listMovies(docSnapshots);   // renderiza lista dos filmes

                    search();                   // pesquisa pelo nome
                    prev.pop();
                    prevPos -= 1;
            
                    if(prevPos == 0){
                        Prevdisabled();         // desativa botao de volta
                    }

        });
}

function paginationDebug(){
    console.log("totalMovies: ", totalMovies);
    console.log("countMovies: ", countMovies);
    console.log("prev: ", prev.length);
}

// ativa ou desativa botoes de prev e next ------------------------------------------------------------------------------

function nextDisabled(){
    // desativa botao de volta
    btnNext.classList.add("disabled");
    document.querySelector('#next > a').classList.add("btn-disabled");
}

function nextActive(){
    // ativa botao de volta
    btnNext.classList.remove("disabled");
    document.querySelector('#next > a').classList.remove("btn-disabled");
}

function Prevdisabled(){
    // desativa botao de volta
    btnPrev.classList.add("disabled");
    document.querySelector('#prev > a').classList.add("btn-disabled");
}

function PrevActive(){
    // ativa botao de volta
    btnPrev.classList.remove("disabled");
    document.querySelector('#prev > a').classList.remove("btn-disabled");
}

// sem uso
function addMovie(doc){
    var add = movies.push(doc.data());      // adiciona os dados do filme no array
    movies[add - 1].id = doc.id;            // adiciona o id do filme no array
    renderMovies(movies[add - 1]);          // renderiza o filme no html
}


// renderiza a lista de filmes na tela
function renderMovies(movie) {

    let div = document.createElement('div');
    div.className = "movie center_el";
    div.setAttribute("style", "padding: 5px;");

    if(movie.watched == false) {
        // se não tiver assistido o filme
        div.innerHTML = `

            <div class="card mb-3" style="max-width: 940px;">
                <div class="row no-gutters">
                <div class="col-md-4 img-center">
                    <img src="${movie.photo}" class="card-img" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <h6 class="card-text">${movie.age}</h6>
                    <p class="card-text card-scroll">${movie.description}.</p>
                    <p class="card-text-info"><small>Diretor: ${movie.director}</small></p>
                    <p class="card-text-info"><small>Adicionado: ${this.convertToDate(movie.added)}</small></p>
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="btWatched('${movie.id}')">Assistiu</button>
                    </div>
                </div>
                </div>
            </div>

        `;
    } else {
        // se tiver assistido o filme
        
        div.innerHTML = `

            <div class="card mb-3" style="max-width: 940px;">
                <div class="row no-gutters">
                <div class="col-md-4 img-center">
                    <img src="${movie.photo}" class="card-img" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <h6 class="card-text">${movie.age}</h6>
                    <p class="card-text card-scroll">${movie.description}.</p>
                    <p class="card-text-info"><small>Diretor: ${movie.director}</small></p>
                    <p class="card-text-info"><small>Adicionado: ${this.convertToDate(movie.added)}</small></p>
                    <p class="card-text-info"><small>Avalição: ${movie.rating}</small></p>
                    <p class="card-text-info"><small>Comentário: ${movie.comment}</small></p>
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="btWatched('${movie.id}')">Editar</button>
                    </div>
                </div>
                </div>
            </div>

        `;
        
    }

    document.querySelector('#movies').append(div);

}

function selectMovie(){
    
    var d = document.getElementById("ddselect");
    var displayMovie = d.options[d.selectedIndex].text;
    
    if(displayMovie == "Adicionado"){
        dataDesc();             // mostra os filmes adicionados mais atuais
    } else if(displayMovie == "Antigos") {
        dataAsc();              // mostra filmes não assistidos
    } else if (displayMovie == "Ano") {
        movieAgeDesc();         // mostra filmes por ano de lançamento
    } else {
        console.log("Error");   
    }
}

function btWatched(id){     // botao para indicar que assistiu o filme
    movieId = id;           // pega id do filme
    mouseup = false;        
    addRatCom();            // pega a avaliação e o comentário e usa o metodo do jquery.js
}

// atualiza filme para visto -------------------------------------------------

function updateInfoMovie(rating, comment){
    var Ref = db.doc(movieId);

    userData.set({
        countMovies: setCountMovies(),       // -1 filme nao visto
        seenMovies: setSeenMovies(),         // +1 filme visto
    }, { merge: true }).then(function(){    
        // atualiza filme ---------------------------------
        var setWithMerge = Ref.set({
            added: updateTime(),
            comment: comment, 
            rating: rating,
            watched: true,
        }, { merge: true }).then(function() {

            // resposta ao conseguir modificar o valor ---------------------------
            if(mouseup == false){
                mouseup = true;         // evita que atualize mais de 1 vez
                saveWatchedMovie(Ref);  // salva filme na coleçao de filmes vistos
            }
            console.log(countMovies, seenMovies);
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });    
        // atualiza filme ---------------------------------
    });
    
}

// salva filme na colecao de filmes vistos ---------------------------------------------------

function saveWatchedMovie(movie){
    
    movie.get().then((doc) => {
        
        dbw.doc(movieId).set(doc.data());

        movie.delete().then(() => { // deleta filme original da coleçao de filmes
            dataDesc();         // faz refresh dos filmes para tirar o botao
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

    });

}

// decrementa -1 a filmes nao-vistos
function setCountMovies(){
    return countMovies = countMovies-1;
}

// acrescenta +1 a filmes vistos
function setSeenMovies(){
    return seenMovies = seenMovies+1;
}

function updateTime(){
    return Math.floor(new Date().getTime()/1000.0); // retorna o tempo
}

function convertToDate(time){

    data = new Date(time * 1000);   // converte para milliseconds, somente -> new Date() <- pega a data do PC
    date = `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`;
    hours = `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`

    return date + " - " + hours;
}

function search(){
    const searchInput = document.getElementById("search");

    const rows = document.querySelectorAll(".card");

    // console.log(rows);

    searchInput.addEventListener("keyup", function (event) {

        const q = event.target.value.toLowerCase();

        rows.forEach((row) => {
            row.querySelector(".card-title").textContent.toLowerCase().startsWith(q)
                ? (row.style.display = "block")
                : (row.style.display = "none");
        });

    });
}

function avaliationInput(){
    const input = document.getElementById("recipient-name").value;
    
}



// window.addEventListener("scroll", function (event) {
//     var scroll = this.scrollY;

//     if(scroll >= 800){
//         window.scroll(0,200);
//         console.log("volta");
//     }
//     console.log(scroll);
// });