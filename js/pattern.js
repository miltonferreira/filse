// funções usadas pelos arquivos JS

function logout(){
    firebase.auth().signOut().catch((error) =>{
        alert('Falha ao sair: ' + error);
      });
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