"use strict";

/**
 * Logic for the game Crazy Eights between a human and the computer.
 */
 function Presenter() {
  /** Constructor:
   * Initialize game by creating and shuffling the deck,
   * dealing one card (other than an 8) to the discard pile, and
   * dealing 7 cards to each player.
   * Then create View object, which will be responsible for the
   * user interface.
   */
  this.deck = new Deck();
   do {
    this.deck.shuffle();
  } while (this.deck.isTopCardAnEight());
  this.pile = new Pile();
  this.pile.acceptACard(this.deck.dealACard());
  this.human = new Player(this.deck);
  this.computer = new Player(this.deck);
  this.view = new View(this);
  this.difficultyLevel = 'medium'; //the default difficulty level
}

/**
 * This function gets called whenever the human selects a card off the deck.
 * This function will update the human hand and have the computer take its turn.
 */
Presenter.prototype.drawCard = function() {
  var card = this.deck.dealACard();
  this.human.add(card);
  this.view.addCardPlayerHand(card); //pass the updated hand to be displayed
  this.finishTurn();
  this.playComputer();
  return;
};

  /**
   * Verify that the card selected by the user is valid to play
   * and update the hand and table accordingly. If the card is not
   * valid to play, alert the user.
   */
Presenter.prototype.playCard = function(cardString) {
  var card = this.human.find(cardString);
  if(this.pile.isValidToPlay(card)) {
    this.human.remove(this.human.indexOf(card));
    this.view.displayHumanHand(this.human.getHandCopy()); //display new cards
    this.pile.acceptACard(card);
    this.view.displayPileTopCard(card);
    if (this.pile.getTopCard().getValue() == "8") {
       this.view.displaySuitPicker();
    } else {
      if(!this.finishTurn()) {
        this.playComputer();
      }
    }
  } else {
    window.alert("That card is not valid, please pick another card.");
  }
  return;
};

/**
 * Allow human to play first.
 */
 Presenter.prototype.playHuman = function() {
  this.view.displayHumanHand(this.human.getHandCopy());
  return;
};

/**
 * Play for the computer. This function switches over the difficulty level
 * and plays a card accordingly.
 * very easy: randomly draws a card 50% of the time.
 * easy: randomly draws a card 33% of the time.
 * medium: the computer only draws if it has no playable card.
 * Otherwise, the computer always plays the first playable card. If it plays an 8,
 * the suit implicitly announced is the suit on the card.
 */
 Presenter.prototype.playComputer = function() {
  var i=0;
  var hand = this.computer.getHandCopy(); // copy of hand for convenience
  var card = null;
  switch(this.difficultyLevel) {
      case 'very easy':
          if(this.getRandomInt(1,2) != 1) {
            card = hand[0];
            while (!this.pile.isValidToPlay(card) && i<hand.length-1) {
              i++;
              card = hand[i];
            }
          }
          break;
      case 'easy':
          if(this.getRandomInt(1,3) != 1) {
            card = hand[0];
            while (!this.pile.isValidToPlay(card) && i<hand.length-1) {
              i++;
              card = hand[i];
            }
          }
          break;
      case 'medium':
          card = hand[0];
          while (!this.pile.isValidToPlay(card) && i<hand.length-1) {
            i++;
            card = hand[i];
          }
          break;
      // case 'hard': //This case hasn't been written yet
      //     break;
  }
  hand = null;
  if (this.pile.isValidToPlay(card)) {
    this.computer.remove(i);
    this.pile.acceptACard(card);
    this.view.displayPileTopCard(card);
    if (this.pile.getTopCard().getValue() == "8") {
      this.pile.setAnnouncedSuit(card.getSuit());
    }
    this.view.displayComputerHand(this.computer.getHandCopy()); //add card
  }
  else {
    var card = this.deck.dealACard();
    this.computer.add(card);
    this.view.addCardComputerHand(card);
  }
  this.finishTurn();
};

/**
 * Called from view with selected suit. Updates pile accordingly.
 */
Presenter.prototype.continueGameAfterSuitSelection = function(suit) {
  this.pile.setAnnouncedSuit(suit);
  if(!this.finishTurn()) {
    this.playComputer(); //we didn't call playComputer if we displayed the suit picker..
  }
  return;
};

/**
 * This function reshuffles the pile into the deck
 * when the deck runs out of cards.
 */
Presenter.prototype.updateDeck = function() {
  var i = 0;
  var topCard = this.pile.removeTopCard();
  var newDeck = new Array();
  while(this.pile.list.length!=0) {
    newDeck[i] = this.pile.removeTopCard();
    i++;
  }
  this.pile.acceptACard(topCard); //put the old top card back on the pile
  this.deck.list = newDeck;
  this.deck.shuffle();
  this.view.updateTable(topCard);
}

/**
 * This function gets called anytime a player finishes their turn
 * and calls view based on the state of the game. This function will
 * return if the game is over.
 */

Presenter.prototype.finishTurn = function() {
  var gameOver = true;
  if (this.human.isHandEmpty()) {
      this.view.announceHumanWinner();
  } else if (this.computer.isHandEmpty()) {
      this.view.announceComputerWinner();
  } else {
    gameOver = false;
    if(this.deck.list.length == 0) {
      this.updateDeck();
    }
  }
  return gameOver;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Note: Using Math.round() will give you a non-uniform distribution!
 * Retrieved from here: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 */
Presenter.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}