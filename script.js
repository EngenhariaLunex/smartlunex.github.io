
var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
window.addEventListener('load', onload);

function onload(event) {
    initWebSocket();
}

function getValues(){
    websocket.send("getValues");
}

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
    getValues();
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

/*
var inp = document.getElementById('slider1');
inp.addEventListener("mousemove", function () {
    document.getElementById('sliderValue1').innerHTML = this.value;
});
console.log(this.value);
websocket.send(1+"s"+(this.value).toString());
*/


function updateSliderPWM(element) { //função que é chamada assim que o valor de qualquer slider é alterado
    var sliderNumber = element.id.charAt(element.id.length-1); //nº do slider (pode ser de 1, 2, 5 ou 6 que são os sliders)
    var sliderValue = document.getElementById(element.id).value; //valor do slider (pode variar de 0 a 255 para os sliders)
    document.getElementById("sliderValue"+sliderNumber).innerHTML = sliderValue; //variável que recebe o valor do slider para printar na página html
    console.log(sliderValue);
    websocket.send(sliderNumber+"s"+sliderValue.toString()); //envia para o ESP a mensagem "1s40" por exemplo
}

function updateCheckbox(element) { //função que é chamada assim que o valor de qualquer botão é alterado
    var sliderNumber = element.id.charAt(element.id.length-1); //nº do slider (pode ser 3, 4 ou 7 que são os botões)
    var sliderValue = document.getElementById(element.id).checked; //valor do slider (pode variar de 0 a 1 para os botões)
    var text = document.getElementById("canal"); //variável text recebe a div "canal" em que estão os sliders que controlam os 2 canais
    if (sliderValue == true){ //se o botão estiver pressionado
        if(sliderNumber == "7"){ //se o botão pressionado for o botão 7 (que ativa os 2 canais)
            text.style.display = "block"; //mostra a div "canal" em que estão os sliders que controlam os 2 canais
        }
        sliderValue = 0; //valor do botão recebe 0 pois a lógica está invertida
    }
    else{
        if(sliderNumber == "7"){ //se o botão pressionado for o botão 7 (que ativa os 2 canais)
            text.style.display = "none"; //esconde a div "canal" em que estão os sliders que controlam os 2 canais
        }
        sliderValue = 1; //valor do botão recebe 1 pois a lógica está invertida
        
    }
    document.getElementById("sliderValue"+sliderNumber).innerHTML = sliderValue;
    console.log(sliderValue);
    websocket.send(sliderNumber+"s"+sliderValue.toString());
}

function onMessage(event) {
    console.log(event.data);
    var myObj = JSON.parse(event.data);
    var keys = Object.keys(myObj);

    for (var i = 0; i < keys.length; i++){
        var key = keys[i];
        document.getElementById(key).innerHTML = myObj[key];
        document.getElementById("slider"+ (i+1).toString()).value = myObj[key];
    }
}




