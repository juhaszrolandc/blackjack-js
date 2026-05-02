export class ViewController {
    render(gameState) {
        this.displayState(gameState.playerChips, gameState.playerHandValue, gameState.dealerHandValue);
        this.setButtonStates(gameState.isRoundInProgress);
        this.removeCards("player");
        this.displayCard("player", gameState.playerHand);
        this.removeCards("dealer");
        this.displayCard("dealer", gameState.dealerHand);
        if (gameState.message.text === "") {
            this.messageHidden();
        }
        else {
            this.displayMessage(gameState.message.text, gameState.message.color);
        }
    }
    displayState(chipsCount, playerHandValue, dealerHandValue) {
        const chipsCountText = document.getElementById("chipsCount");
        const playerHandValueText = document.getElementById("playerHandValue");
        const dealerHandValueText = document.getElementById("dealerHandValue");
        chipsCountText.innerHTML = chipsCount;
        playerHandValueText.innerText = playerHandValue;
        dealerHandValueText.innerText = dealerHandValue;
    }
    createCardElement(card) {
        const cardImage = document.createElement('img');
        cardImage.src = `./images/deck/${card.rank}_of_${card.suit}.svg`;
        return cardImage;
    }
    displayCard(participant, cards) {
        const handElement = document.getElementById(`${participant}HandContainer`);
        const cardList = Array.isArray(cards) ? cards : [cards];
        for (const card of cardList) {
            handElement.appendChild(this.createCardElement(card));
        }
    }
    removeCards(participant) {
        const handElement = document.getElementById(`${participant}HandContainer`);
        handElement?.replaceChildren();
    }
    displayMessage(text, color) {
        const message = document.getElementById("message");
        message.innerHTML = text;
        message.style.background = color;
        message.style.visibility = "visible";
    }
    messageHidden() {
        const message = document.getElementById("message");
        message.style.visibility = "hidden";
    }
    clear() {
        this.messageHidden();
        this.removeCards("player");
        this.removeCards("dealer");
        this.displayState("-", "-", "-");
    }
    setButtonStates(isRoundInProgress) {
        const startBtn = document.getElementById("startBtn");
        const hitBtn = document.getElementById("hitBtn");
        const standBtn = document.getElementById("standBtn");
        startBtn.disabled = isRoundInProgress;
        hitBtn.disabled = !isRoundInProgress;
        standBtn.disabled = !isRoundInProgress;
    }
}
