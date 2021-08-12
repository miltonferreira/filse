// funções usadas pelos arquivos JS

function logout(){
    firebase.auth().signOut().catch((error) =>{
        alert('Falha ao sair: ' + error);
    });
    
    // logout com implemental <<<<<<<<<<<<<<<<<<<<<<<<<
    //   firebase.auth().signOut().then(()=> {
    //     // Sign-out successful.
    //   }).catch(function(error) {
    //     // An error happened.
    //   });
}

function convertToDate(time){

    data = new Date(time * 1000);   // converte para milliseconds, somente -> new Date() <- pega a data do PC
    date = `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`;
    hours = `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`

    return date + " - " + hours;
}

function updateTime(){
    return Math.floor(new Date().getTime()/1000.0); // retorna o tempo
}

// rastreia progresso de upload
function trackUpload(upload){

    return new Promise((resolve, reject) => {

        upload.on('state_changed', (snapshot)=>{
            console.log((snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2) + '%');
        },(error)=>{
            // se houve error retorna o erro
            alert('Falha ao enviar imagem: ', error);
            reject(error);
        },()=>{
            // se fazer upload com sucesso
            console.log("Sucesso ao enviar imagem!");
            resolve();
        });
    
        // pausa upload ----------------------------------
        // var playPauseUpload = true;

        // playPauseBtn.onclick = (()=>{
        //     playPauseUpload = !playPauseUpload; // toggle do estado de upload
    
        //     if(playPauseUpload){
        //         upload.resume();    // continua fazendo upload da image
        //         playPauseBtn.innerHTML = 'Pausar';
        //     }else{
        //         upload.pause();     // pausa upload da imagem
        //         playPauseBtn.innerHTML = 'Continuar';
        //     }
        // });
    
        // cancela upload ---------------------------------
        // cancelBtn.onclick = (()=>{
        //     upload.cancel();            // cancela upload
            
        // });
    });

}
