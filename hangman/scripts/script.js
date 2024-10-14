import { words } from "./words.js";
import { createPopup } from "./popup.js";

const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const body = document.body;
const header = createElementF(body, 'header', 'page-header');
const main = createElementF(body, 'main', 'page-main');
let hangmanParts = [];
let currentPart = 0;
let letters = [];
let keys = [];
let position = [];
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
    link1.textContent = 'Start game';
    link1.href = '';

    link1.addEventListener('click', (evt) => {
        evt.preventDefault();
        startGame();
    });

    const item2 = createElementF(ul, 'li', 'header__item');
    const link2 = createElementF(item2, 'a', 'header__link');
    link2.textContent = 'Show solution';
    link2.href = '';

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

    if (word.hint) {
        const wordHint = createElementF(parentElement, 'p', 'word__hint');
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
}

// keyEvents

keys.forEach(item => {
    item.addEventListener('click', () => {
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
    });
});

//additional functions

function startGame() {
    hangmanParts = [];
    currentPart = 0;
    letters = [];
    keys = [];
    position = [];
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
