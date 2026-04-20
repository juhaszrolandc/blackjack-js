export class ViewController {
    init(startRound, takeHit, takeStand) {
        const startBtn = document.getElementById("startBtn");
        const hitBtn = document.getElementById("hitBtn");
        const standBtn = document.getElementById("standBtn");
        startBtn.addEventListener("click", () => startRound());
        hitBtn.addEventListener("click", () => takeHit());
        standBtn.addEventListener("click", () => takeStand());
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
        cardImage.src = `../assets/images/deck/${card.rank}_of_${card.suit}.svg`;
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
    setButtonStates(startButtonDisable = true, hitButtonDisable = false, standButtonDisable = false) {
        const startBtn = document.getElementById("startBtn");
        const hitBtn = document.getElementById("hitBtn");
        const standBtn = document.getElementById("standBtn");
        startBtn.disabled = startButtonDisable;
        hitBtn.disabled = hitButtonDisable;
        standBtn.disabled = standButtonDisable;
    }
}
//# sourceMappingURL=ViewController.js.map