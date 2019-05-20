window.onload = function() {
	logoStartProp();
	logoEndProp();
};

window.onresize = function() {
	logoStartProp();
	logoEndProp();
	cardProp();
};

function cardProp(){
	let cards = document.getElementsByClassName("card");
	let cardWidth = cards[0].offsetWidth;
	for (let i = 0; i < cards.length; i++){
		cards[i].style.height = cardWidth*1.389 +"px";
	}
}

function logoStartProp(){
	let logoImg = document.getElementById("logoStart");
	let logoWidth = logoImg.offsetWidth;
	logoImg.style.height = logoWidth*0.55 +"px";
}

function logoEndProp(){
	let logoImg = document.getElementById("logoEnd");
	let logoWidth = logoImg.offsetWidth;
	logoImg.style.height = logoWidth*0.55 +"px";
}

let cardsArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
let playingField = document.getElementById('playingField');
let time = 5000;
let soundSet = 0;

let cardsComplete = createCards();

function createCards(){
	let sliceCardsArray = 0;
arShuffle(cardsArray); //Перемешивание изначального массива
sliceCardsArray = cardsArray.slice(0,9); //Оставить в массиве 9 элементов
let playCards = sliceCardsArray.concat(sliceCardsArray); //Удвоение элементов в массиве
arShuffle(playCards); //Перемешивание удвоенного массива
return playCards;
}

let openCount = 0;
let tryCount = 0;
let card1;
let card2;
let saveElem1;
let saveElem2;
let stat = 1;
let scores = 0;

createGame(cardsComplete);

document.getElementById("soundBtn").onclick = function (event) {
	if (soundSet == 0){
		this.style.backgroundImage = "url('img/sndoff.png')";
		soundSet = 1;
	} else if (soundSet == 1) {
		this.style.backgroundImage = "url('img/sndon.png')";
		soundSet = 0;
	}
}

document.getElementById("btnStart").onclick = function (event) {
	sound(1);
	document.getElementById("startScreen").style.display = "none";
	document.getElementById("gameScreen").style.display = "block";
	cardProp();
	showCards();
	setTimeout("hideCards()", time);
	setTimeout("unblockRestart()", time);
}

document.getElementById("btnRestart").onclick = function (event) {
	this.style.display = "none";
	sound(1);

	openCount = 0;
	tryCount = 0;
	card1;
	card2;
	saveElem1;
	saveElem2;
	stat = 1;
	scores = 0;

	playingField.innerHTML = "";
	document.getElementById("scores").innerHTML = "Очки: " + scores;

	cardsComplete = createCards();
	createGame(cardsComplete);
	cardProp();
	showCards();
	setTimeout("hideCards()", time);
	setTimeout("unblockRestart()", time);
}

document.getElementById("btnRestart2").onclick = function (event) {
	sound(1);
	document.getElementById("resultScreen").style.display = "none";
	document.getElementById("gameScreen").style.display = "block";

	openCount = 0;
	tryCount = 0;
	card1;
	card2;
	saveElem1;
	saveElem2;
	stat = 1;
	scores = 0;

	playingField.innerHTML = "";
	document.getElementById("scores").innerHTML = "Очки: " + scores;

	cardsComplete = createCards();
	createGame(cardsComplete);
	cardProp();
	showCards();
	setTimeout("hideCards()", time);
}

function unblockRestart(){
	document.getElementById("btnRestart").style.display = "inline-block";
}

function addType(array){
	let funcArray = [];
	for (let i = 0; i < array.length; i++) {
		let num = Math.random();
		let x;
		let a = 1;
		if (num < 0.25){
			x = array[i] + "C";
		} else if (num < 0.5) {
			x = array[i] + "D";
		} else if (num < 0.75) {
			x = array[i] + "H";
		} else {
			x = array[i] + "S";
		}

		for (let y = 0; y < funcArray.length; y++) {
			if (x == funcArray[y]){
				i--;
				y = 100;
				a = 2;
			} 
		}
		if (a == 1){
			array[i] = x;
			funcArray[funcArray.length] = x;
		}
	} //____________Функция не используется, нужна если требуется рандомизировать масти карт
}

function arShuffle(array) {
	for (let i = array.length - 1; i > -1; i--) {
		let num = Math.floor(Math.random() * (i + 1));
		let d = array[num];
		array[num] = array[i];
		array[i] = d;
	}
	return true; //__________________________________________________Перемешивание массива
}

function createGame(array){ //______________________________________________Добавление тегов с картами
	for (let i = 0; i < array.length; i++){
		let num = i;
		let div = document.createElement('div');
		div.className = "card";
		div.setAttribute("id", array[num]);
		div.setAttribute("onclick", "clickFunc(this);");
		div.setAttribute("data-tid", "Card");
		playingField.appendChild(div);
	}
}

function showCards(){ //______________________________________Демонстрация карт в начале игры
	let cards = document.getElementsByClassName("card");
	for (let i = 0; i < cards.length; i++){
		cards[i].style.backgroundImage = "url('img/cards/" + cards[i].id +".png')";
	}
}

function hideCards(){ //______________________________________Скрытие карт в начале игры
	let cards = document.getElementsByClassName("card");
	for (let i = 0; i < cards.length; i++){
		cards[i].style.backgroundImage = "url('img/cards/card.png')";
		cards[i].style.cursor = "pointer";
		cards[i].classList.add("cardHover");
	}
	stat = 0;
}


function clickFunc(elem){ //______________________________________Клик по карте
	if (stat == 1){
		return;
	}
	sound(2);
	elem.style.backgroundImage = "url('img/cards/" + elem.id +".png')";
	elem.setAttribute("data-tid", "Card-flipped");
	tryCount++;
	elem.removeAttribute("onclick", "clickFunc(this);");
	elem.style.cursor = "default";
	elem.classList.remove("cardHover");
	if (tryCount == 1){
		card1 = elem.id; 
		saveElem1 = elem;
		console.log("Карта 1 = "+ card1);
	} else {
		card2 = elem.id; 
		saveElem2 = elem;
		console.log("Карта 2 = "+ card2);
		tryCount = 0;
		stat = 1;
		setTimeout("cardsMatch()", 400);
	}
}

function sound(num){ //________________________________Звуки
	if (soundSet == 1){
		return;
	}
	var sound = new Audio;
	if (num == 1){
		sound.src = "sounds/btnclick.wav";
	} else if (num == 2){
		sound.src = "sounds/cardclick.wav";
	} else if (num == 3){
		sound.src = "sounds/errm.wav";
	} else if (num == 4) {
		sound.src = "sounds/FFVictory.mp3";
	}  else{
		sound.src = "sounds/gt.mp3";
	}
	sound.volume = 0.04;
	sound.play();
}

function cardsMatch(){ //______________________________________Сравнение карт, запуск расчета и обновления очков по результату, обновление попытки сравнения
	if(card1 == card2){
		console.log("Равны");
		openCount = openCount + 1;
		saveElem1.removeAttribute("onclick", "clickFunc(this);");
		saveElem2.removeAttribute("onclick", "clickFunc(this);");
		saveElem1.style.cursor = "default";
		saveElem2.style.cursor = "default";
		refreshScores (1);
	} else {
		console.log("Не равны");
		saveElem1.style.backgroundImage = "url('img/cards/card.png')";
		saveElem2.style.backgroundImage = "url('img/cards/card.png')";
		saveElem1.setAttribute("data-tid", "Card");
		saveElem2.setAttribute("data-tid", "Card");
		saveElem1.setAttribute("onclick", "clickFunc(this);");
		saveElem2.setAttribute("onclick", "clickFunc(this);");
		saveElem1.style.cursor = "pointer";
		saveElem2.style.cursor = "pointer";
		saveElem1.classList.add("cardHover");
		saveElem2.classList.add("cardHover");
		refreshScores ();
		sound(3);
	}
	stat = 0;
}

function refreshScores (result){ //______________________________________Расчет изменения очков и их обновление на странице
	if (result === 1){
		scores = scores + (10 - openCount) * 42;
	} else {
		scores = scores - openCount * 42;
	}
	let scoresText = document.getElementById("scores");
	scoresText.innerHTML = "Очки: " + scores;
	if (openCount > 8){
		setTimeout("resultScreen()", 1000);
	}
}

function resultScreen (){ //______________________________________________Отображение экрана с результатами игры
	if (scores > 0){
		sound(4);
	} else {
		sound(5);
	}
	document.getElementById("resultScreen").style.display = "flex";
	document.getElementById("gameScreen").style.display = "none";
	document.getElementById("endScore").innerHTML = "Ваш итоговый счет: " + scores;
	logoEndProp();
}