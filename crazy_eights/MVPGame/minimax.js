/**
 * Play for the computer.  In this version, the computer always plays
 * the first card in its hand that is playable.  If it plays an 8,
 * the suit implicitly announced is the suit on the card.
 */
 playComputer = function() {
  if(this.deck.list.length == 0) {
    this.updateDeck();
  }
  // Play the first playable card, or pick if none is playable.
  var i=0;
  var hand = this.computer.getHandCopy(); // copy of hand for convenience
  var computerHand = window.document.getElementById("computerHand");
  while (computerHand.firstChild) {
    computerHand.removeChild(computerHand.firstChild);
  }
  var card = hand[0];
  while (!this.pile.isValidToPlay(card) && i<hand.length-1) {
    i++;
    card = hand[i];
  }
  hand = null;
  if (this.pile.isValidToPlay(card)) {
    this.computer.remove(i);
    this.pile.acceptACard(card);
    this.view.displayPileTopCard(card);
    if (this.pile.getTopCard().getValue() == "8") {
      this.pile.setAnnouncedSuit(card.getSuit());
    }
    this.view.displayComputerHand(this.computer.getHandCopy());
    if (this.computer.isHandEmpty()) {
      this.view.announceComputerWinner();
    }
  }
  else {
    this.computer.add(this.deck.dealACard());
    this.view.displayComputerHand(this.computer.getHandCopy());
  }
  return;
};
