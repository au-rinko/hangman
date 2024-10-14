export function createPopup(body, isWinner) {
    const bg = document.createElement('div');
    body.appendChild(bg);
    bg.classList.add('dark-bg', 'dark-bg--shown');
    
    const popup = document.createElement('section',);
    body.appendChild(popup);
    popup.classList.add('popup');

    const popupContainer = document.createElement('div');
    popup.appendChild(popupContainer);
    popupContainer.classList.add('popup__container');

    const h2 = document.createElement('h2');
    popupContainer.appendChild(h2);
    h2.classList.add('popup__title');

    if (isWinner) {
        h2.textContent = 'Congratulations! You are the winner!';
    } else {
        h2.textContent = 'Sorry, you lose..';
    }
    
    const submitBtn = document.createElement('button');
    popupContainer.appendChild(submitBtn);
    submitBtn.type = 'button';
    submitBtn.classList.add('popup__button');
    submitBtn.textContent = 'Ok';

    submitBtn.addEventListener('click', endGame);
    window.addEventListener("keydown", (evt)=>{
        if(evt.keyCode === 13){
            evt.preventDefault();
            endGame();
        }
    });

    function endGame() {
        popup.remove();
        bg.classList.remove('dark-bg--shown');
    }
}

