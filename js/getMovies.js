
var firestore = firebase.firestore();

var dbMovie = null;              // recebe coleçao de filmes do user
var dbVMovie = null         // recebe colecao de filmes vistos do user

// paginacao -----------------------------------------------------------
// botoes de anterior e proximo

var btnPrev = document.querySelector('#prev');
var btnNext = document.querySelector('#next');

var btNext = false;     // evita que tenha interação mesmo com botao desativado

var prev = [];          // volta na paginacao
var prevPos = 0;        // indica quantas vezes pode voltar
var last = null;        // pega o ultimo filme da lista
var count = 3;          // quantidade de filmes por pagina

var descName = null;    // tipo de ordenação dos filmes, adicionado ou por ano
var orderName = null;   // tipo de ordenação de Decrescente(atual>antigo) ou Crescente(antigo>atual)

var isNext = false;     // indica que usou paginacao

// conta a quantidade de filmes por pagina ----------------------------

var countMovies = 0;    // pega quantidade de filmes nao-vistos
var totalMovies = 0;    // soma os filmes por paginacao quando avança com botao next
var moviesPerPage = 0;  // pega quantos filmes a pagina carregou para controlar na paginacao

// verifica se esta logado -------------------------------------------
firebase.auth().onAuthStateChanged((user) => {
    if(user) {

        user = firestore.collection("Users").doc(user.uid);
                
        dbMovie = user.collection("Movies");             // pega a coleção no firestore do user
        dbVMovie = user.collection("viewedMovies");      // recebe colecao de filmes vistos do user

        user.get().then((doc) =>{
            if(doc.exists){
                renderAvatar(doc.data().photo);         // adiciona a foto do user
                dbMovie.get().then((snapshot)=>{
                    countMovies = snapshot.size;
                    dataDesc();  // mostra filmes adicionados dos atuais aos antigos
                });
            } else {
                window.location.replace('index.html');  // se nao tiver o user na lista de user's, volta para index.html
            }
        });    

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

// dados dos filmes --------------------------------------------------------------------------------------------------------

var movies = [];                                // recebe a lista do filmes
var movieId;                                    // recebe ID do filme
var mouseup = false;                            // evita que envie várias vezes o update do filme

// Recebendo um documento -----------------------------------------------

// função não usada
function moviesAll() {
    dbMovie.get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
        console.log(doc.id, "=>", doc.data());
        })
    });
}
// função não usada
function moviesWhere(data1, op, data2) {
    dbMovie.where(data1, op, data2).get().then(function(querySnapshot){
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
    docSnapshots.forEach((doc) =>{
        var add = movies.push(doc.data());      // adiciona os dados do filme no array
        movies[add - 1].id = doc.id;            // adiciona o id do filme no array
        renderMovies(movies[add - 1]);          // renderiza o filme na lista do html
    });
}

// paginação para avançar lista de filmes
function paginationNext(){

    loadingPage();  // mostra esqueleto de loading enquanto carrega filmes

    // se for a primeira vez que carrega a lista de filmes cai nessa condição
    if(isNext == false){

        let first = dbMovie.orderBy(descName, orderName).limit(count);       // ordena conforme condição das 3 variaveis

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
        let first = dbMovie.orderBy(descName, orderName).startAfter(last).limit(count);

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

// paginação de voltar lista de filmes
function paginationPrev(){

    loadingPage();  // mostra esqueleto de loading enquanto carrega filmes

    var first = dbMovie.orderBy(descName, orderName).startAt(prev[prevPos - 1]).limit(count);

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

// Mostra esqueleto de loading enquanto tiver carregando filmes
function loadingPage(){
    document.querySelector('#movies').innerHTML = `
        <div class="movie center_el" style="padding: 5px;">
            <div class="card mb-3" style="max-width: 940px;">
                <div class="row no-gutters">
                <div class="col-md-4 img-center">
                    <div class="loading img-skeleton center_el_2"></div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title loading title-skeleton"></h5>
                        <h6 class="card-text loading rating-skeleton"></h6>
                        <p class="card-text card-scroll loading com-skeleton"></p>
                        <p class="card-text-info loading add-skeleton"><small></small></p>
                        <p class="card-text-info loading add-skeleton"><small></small></p>
                        <p class="card-text loading button-skeleton"></p>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="movie center_el" style="padding: 5px;">
            <div class="card mb-3" style="max-width: 940px;">
                <div class="row no-gutters">
                <div class="col-md-4 img-center">
                    <div class="loading img-skeleton center_el_2"></div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title loading title-skeleton"></h5>
                        <h6 class="card-text loading rating-skeleton"></h6>
                        <p class="card-text card-scroll loading com-skeleton"></p>
                        <p class="card-text-info loading add-skeleton"><small></small></p>
                        <p class="card-text-info loading add-skeleton"><small></small></p>
                        <p class="card-text loading button-skeleton"></p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    `;
}

// ativa ou desativa botoes de prev e next ------------------------------------------------------------------------------
//#region botoes de prev e next
function nextDisabled(){
    // desativa botao de volta
    btnNext.classList.add("disabled");      // util para trocar estilização do botão via js
    document.querySelector('#next > a').classList.add("btn-disabled");
}

function nextActive(){
    // ativa botao de volta
    btnNext.classList.remove("disabled");   // util para trocar estilização do botão via js
    document.querySelector('#next > a').classList.remove("btn-disabled");
}

function Prevdisabled(){
    // desativa botao de volta
    btnPrev.classList.add("disabled");      // util para trocar estilização do botão via js
    document.querySelector('#prev > a').classList.add("btn-disabled");
}

function PrevActive(){
    // ativa botao de volta
    btnPrev.classList.remove("disabled");   // util para trocar estilização do botão via js
    document.querySelector('#prev > a').classList.remove("btn-disabled");
}
//#endregion

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
                    <p class="card-text-info"><small>Adicionado: ${convertToDate(movie.added)}</small></p>
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
                    <p class="card-text-info"><small>Adicionado: ${convertToDate(movie.added)}</small></p>
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

// escolhe a ordenação
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

// botao para indicar que assistiu o filme
function btWatched(id){     
    movieId = id;           // pega id do filme
    mouseup = false;        
    addRatCom();            // pega a avaliação e o comentário e usa o metodo do jquery.js
}

// atualiza filme para visto -------------------------------------------------
function updateInfoMovie(rating, comment){

    let Ref = dbMovie.doc(movieId);

    let data = {
        added: updateTime(),
        comment: comment, 
        rating: rating,
        watched: true,
    };

    // se colocar {data} infos vão como map
    Ref.set(data, {merge: true}).then(()=>{

        // resposta ao conseguir modificar o valor ---------------------------
        if(mouseup == false){
            mouseup = true;         // evita que atualize mais de 1 vez
            saveWatchedMovie(Ref);  // salva filme na coleçao de filmes vistos
        }
        
    }).catch((error)=>{
        console.error("Error writing document: ", error);
    }); 
    
}

// salva filme na colecao de filmes vistos ---------------------------------------------------
function saveWatchedMovie(movie){
    
    movie.get().then((doc) => {
        
        dbVMovie.doc(movieId).set(doc.data());  // salva viu na coleção de filmes vistos

        movie.delete().then(()=>{               // deleta filme original da coleçao de filmes não-vistos
            dataDesc();                         // faz refresh dos filmes para tirar o botao
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

    });

}

function search(){
    const searchInput = document.getElementById("search");

    const rows = document.querySelectorAll(".card");

    // console.log(rows);

    searchInput.addEventListener("keyup", (event) => {

        const q = event.target.value.toLowerCase(); // pega o que user digitou na pesquisa

        rows.forEach((row) => {
            row.querySelector(".card-title").textContent.toLowerCase().startsWith(q)
                ? (row.style.display = "block")
                : (row.style.display = "none");
        });

    });
}

// Não sei onde usa
function avaliationInput(){
    const input = document.getElementById("recipient-name").value;
    
}

// botao de logout
btnLogout.addEventListener('click', function(){
    logout();
});

// window.addEventListener("scroll", function (event) {
//     var scroll = this.scrollY;

//     if(scroll >= 800){
//         window.scroll(0,200);
//         console.log("volta");
//     }
//     console.log(scroll);
// });