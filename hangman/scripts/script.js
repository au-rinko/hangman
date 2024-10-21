import { words } from "./words.js";
import { createPopup } from "./popup.js";

const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const menuArray = [
    {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30"><path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"/></svg>`,
        title: 'Start game'
    },
    {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="30"><path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z"/></svg>`,
        title: 'Show solution'
    }
];

const body = document.body;
const header = createElementF(body, 'header', 'page-header');
const main = createElementF(body, 'main', 'page-main');
let hangmanParts = [];
let currentPart = 0;
let letters = [];
let keys = [];
let position = [];
let menu = [];
let incorrectAttempts = {
    attempts: 0,
    element: null
};

let word = words[getRandomNumber(words.length)];


createMainSection();
createHeaderSection();

//creating html elements

function createElementF(parentElement, tag, className) {
    const element = document.createElement(tag);
    parentElement.appendChild(element);
    if (className && Array.isArray(className)) {
        className.forEach(item => {
            element.classList.add(item);
        });
    } else if (className) {
        element.classList.add(className);
    }

    return element;
}

function createHeaderSection() {
    const headerContainer = createElementF(header, 'div', ['container', 'header__container']);

    const logo = createElementF(headerContainer, 'h1', 'logo');
    logo.textContent = 'Hangman';

    const nav = createElementF(headerContainer, 'nav', 'header__nav');
    const ul = createElementF(nav, 'ul', 'header__list');

    const item1 = createElementF(ul, 'li', 'header__item');
    const link1 = createElementF(item1, 'a', 'header__link');
    menu.push(link1);

    const item2 = createElementF(ul, 'li', 'header__item');
    const link2 = createElementF(item2, 'a', 'header__link');
    menu.push(link2);

    createMenu();

    link1.addEventListener('click', (evt) => {
        evt.preventDefault();
        startGame();
    });

    link2.addEventListener('click', (evt) => {
        evt.preventDefault();
        for (let i = 0; i < letters.length; i++) {
            console.log(word);
            letters[i].textContent = word.word[i].toUpperCase();
            letters[i].classList.add('word__item--shown');
        }
        keys.forEach(item => {
            item.disabled = true;
        });
    });

}

window.addEventListener('resize', createMenu);

function createMenu() {
    for (let i = 0; i < menu.length; i++) {
        if (window.innerWidth < 768) {
            menu[i].innerHTML = menuArray[i].svg;
            menu[i].title = menuArray[i].title;
        } else {
            menu[i].textContent = menuArray[i].title;
        }
        menu[i].href = '';
    } 
}

function createMainSection() {
    const mainContainer = createElementF(main, 'div', 'container');

    createGameSection(mainContainer);
}

function createGameSection(parentElement) {
    const gameSection = createElementF(parentElement, 'section', 'game');

    const imagesBlock = createElementF(gameSection, 'div', 'game__images');
    createImagesBlock(imagesBlock);

    const gameBlock = createElementF(gameSection, 'div', 'game__controlls');
    createGameBlock(gameBlock);
}

function createImagesBlock(parentElement) {
    const figure = createElementF(parentElement, 'figure', 'game__figure');

    const gallowImg = createElementF(figure, 'img', 'game__img');
    addImgInfo(gallowImg, 'assets/img/gallows.svg', 'Gallow');

    const gallowCaption = createElementF(figure, 'figcaption', null);
    gallowCaption.textContent = 'Hangman Game';

    createHangman(parentElement);
}

function createHangman(parentElement) {
    const ul = createElementF(parentElement, 'ul', 'images__list');

    const headItem = createElementF(ul, 'li', ['images__item--head', 'images__item']);
    const head = createElementF(headItem, 'img', 'images__item-img');
    addImgInfo(head, 'assets/img/head.svg', 'head');
    hangmanParts.push(head);

    const bodyItem = createElementF(ul, 'li', ['images__item--body', 'images__item']);
    const leftHand = createElementF(bodyItem, 'img', 'images__item-img');
    addImgInfo(leftHand, 'assets/img/hand-left.svg', 'left hand');
    

    const body = createElementF(bodyItem, 'img', 'images__item-img');
    addImgInfo(body, 'assets/img/body.svg', 'body');
    hangmanParts.push(body);
    hangmanParts.push(leftHand);

    const rightHand = createElementF(bodyItem, 'img', 'images__item-img');
    addImgInfo(rightHand, 'assets/img/hand-right.svg', 'right hand');
    hangmanParts.push(rightHand);

    const legsItem = createElementF(ul, 'li', ['images__item--legs', 'images__item']);
    const leftLeg = createElementF(legsItem, 'img', 'images__item-img');
    addImgInfo(leftLeg, 'assets/img/leg-left.svg', 'left leg');
    hangmanParts.push(leftLeg);

    const rightLeg = createElementF(legsItem, 'img', 'images__item-img');
    addImgInfo(rightLeg, 'assets/img/leg-right.svg', 'right leg');
    hangmanParts.push(rightLeg);
}

function createGameBlock(parentElement) {
    const ul = createElementF(parentElement, 'ul', 'word__list');

    for (let i = 0; i < word.word.length; i++) {
        const li = createElementF(ul, 'li', 'word__item');
        li.dataset.letter = word.word[i];
        letters.push(li);
    }

    if (word.hint.length > 0) {
        const wordHint = createElementF(parentElement, 'p', 'word__hint');
        wordHint.textContent = `Hint: ${word.hint}`;
    }

    const attempts = createElementF(parentElement, 'p', 'word__incorrect');
    attempts.innerHTML = `<strong>Incorrect attempts:</strong> `;
    const attemptsSpan = createElementF(attempts, 'span', null);
    incorrectAttempts.element = attemptsSpan;
    attemptsSpan.textContent = `${incorrectAttempts.attempts} / ${hangmanParts.length}`;

    createKeyboard(parentElement);
}

function createKeyboard(parentElement) {
    const ul = createElementF(parentElement, 'ul', 'controlls__list');

    for (let i = 0; i < 26; i++) {
        const li = createElementF(ul, 'li', 'controlls__items');
        const button = createElementF(li, 'button', 'controlls__button');
        button.textContent = array[i];
        keys.push(button);
    }

    keys.forEach(item => {
        item.addEventListener('click', () => {    
            findLetter(item);
        });
    });
    
    window.addEventListener("keydown", (evt)=>{
        if (evt.keyCode > 64 && evt.keyCode < 90) {
            evt.preventDefault();
            const pressedKey = keys.filter(item => item.textContent === evt.key.toUpperCase());
            if (pressedKey.length > 0 && !pressedKey[0].disabled) findLetter(pressedKey[0]);
        }
    });
}

//additional functions

function startGame() {
    hangmanParts = [];
    currentPart = 0;
    letters = [];
    position = [];
    keys = [];
    incorrectAttempts = {
        attempts: 0,
        element: null
    };
    word = words[getRandomNumber(words.length)];
    main.innerHTML = '';
    createMainSection();
}

function stopGame() {
    const isWin = win();
    createPopup(body, isWin);
    keys.forEach(item => {
        item.disabled = true;
    });
}

function win() {
    return letters.every(item => item.classList.contains('word__item--shown'));
}

function findLetter(item) {
    item.disabled = true;
    position = checkLettters(item.textContent.toLowerCase());
    console.log(position);
    if (position.length !== 0) {
        for (let i = 0; i < position.length; i++) {
            letters[position[i]].textContent = item.textContent;
            letters[position[i]].classList.add('word__item--shown');
        }
        const isWin = win();
        if (isWin) stopGame();
    } else {
        addMistake();
        showParts();
    }
}

function checkLettters(letter) {
    let position = [];
    word.word.split('').filter((item, index) => {
        if (item === letter) {
            console.log(item);
            position.push(index);
            return item;
        }
    });

    return position;
}

function addMistake() {
    incorrectAttempts.attempts += 1;
    incorrectAttempts.element.textContent = `${incorrectAttempts.attempts} / ${hangmanParts.length}`
}

function showParts() {
    if (currentPart < 6) {
        hangmanParts[currentPart].classList.add('images__item-img--shown');
        currentPart++;
        if (currentPart === 6) stopGame();
    } 
}

function addImgInfo(element, url, alt) {
    element.src = url;
    element.alt = alt;
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}
