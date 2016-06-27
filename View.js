"use strict";

/**
 * Provide methods for interacting with the user.
 */
 function View(presenter) {
  this.topCard = null;
  this.presenter = presenter;
  this.displayComputerHand(this.presenter.computer.getHandCopy());
  this.displayTable(this.presenter.pile.getTopCard());
  this.setSuitListener();
  this.setRuleListener();
  this.setForfeitListener();
  this.setStartGameListener();
}

/**
 * Display information about the computer's hand.
 * Hand is an array of card's.
 */
 View.prototype.displayComputerHand = function(hand) {
  var computerHand = window.document.getElementById("computerHand");
  while (computerHand.firstChild) {
    computerHand.removeChild(computerHand.firstChild);
  }
  var left = 0;
  for (var i = 0; i < hand.length; i++) {
    left += 20;
    var img = window.document.createElement("img");
    img.setAttribute("src", "../images/PlayingCards/back.png");
    img.setAttribute("alt", "Card Back");
    img.style.position = "absolute";
    img.style.left = (left + "px");
    img.style.top = "0";
    img.style.width = "71px";
    img.style.height = "96px";
    img.style.zIndex = i;
    computerHand.appendChild(img);
  }
  return;
};


/**
 *  Select a suit graphically for an 8. Function creates an event
 *  listener that will manage adjusting the card based on the user's
 *  choice of suit
 */
View.prototype.setSuitListener = function() {
	var presenter = this.presenter;
  var suitClicker = function(event) {
    var suit = event.target.id;
    var pile = window.document.getElementById("table").childNodes[1];
    pile.setAttribute("src", "../images/PlayingCards/" + "8"+suit + ".png");
    pile.setAttribute("alt", "8"+suit);
    var suitMenu = window.document.getElementById("suitMenu");
    suitMenu.style.display="none";
    presenter.continueGameAfterSuitSelection(suit);
  };
  var clubs = window.document.getElementById("c");
  clubs.addEventListener("click",suitClicker, false);
  var diamonds = window.document.getElementById("d");
  diamonds.addEventListener("click",suitClicker, false);
  var hearts = window.document.getElementById("h");
  hearts.addEventListener("click",suitClicker, false);
  var spades = window.document.getElementById("s");
  spades.addEventListener("click",suitClicker, false);
  return;
};

/**
 * Display the top card of the discard pile (at the next opportunity).
 * This function removes the current top card and adds the new top card.
 */
 View.prototype.displayPileTopCard = function(card) {
  this.topCard = card;
  var table = window.document.getElementById("table");
  var newPile = window.document.createElement("img");
  newPile.setAttribute("src", card.getURL());
  newPile.setAttribute("alt", card.toString());
  newPile.style.left = "71px";
  newPile.style.top = "0";
  newPile.style.width = "71px";
  newPile.style.height = "96px";
  table.removeChild(table.childNodes[1]);
  table.appendChild(newPile);
  return table;
};

/**
 * Display the initial pile and deck images on the table.
 * Only meant for initialization.
 */
View.prototype.displayTable = function(topCard) {
  this.topCard = topCard;
  var pres = this.presenter;
  var element = window.document.getElementById("table");
  var deck = window.document.createElement("img");
  var deckSelect = function() {
    pres.drawCard();
  };
  deck.setAttribute("src", "../images/PlayingCards/back.png");
  deck.setAttribute("alt", "Card Back");
  deck.style.left = "0";
  deck.style.top = "0";
  deck.style.width = "71px";
  deck.style.height = "96px";
  deck.style.cursor="pointer";
  deck.addEventListener("click", deckSelect, false);
  element.appendChild(deck);
  var pile = window.document.createElement("img");
  pile.setAttribute("src", topCard.getURL());
  pile.setAttribute("alt", topCard.toString());
  pile.style.left = "71px";
  pile.style.top = "0";
  pile.style.width = "71px";
  pile.style.height = "96px";
  element.appendChild(pile);
  return;
};

/**
 * Display the human hand. This function removes any cards that are currently
 * in the hand and then readds the human player's current hand to the table.
 */
View.prototype.displayHumanHand = function(hand) {
  var playerHand = window.document.getElementById("playerHand");
	var pres = this.presenter;
	while (playerHand.firstChild) {
		playerHand.removeChild(playerHand.firstChild);
	}
  var humanSelect = function(event) {
    var img1 = window.document.getElementById(event.target.id);
    img1.style.top = "0";
    img1.removeEventListener("mouseover", onRollOver);
    img1.removeEventListener("mouseleave", offRollOver);
    pres.playCard(event.target.alt);
  };
  var onRollOver = function(event) {
    var img1 = window.document.getElementById(event.target.id);
    img1.style.top = "-15px";
  };
  var offRollOver = function(event) {
    var img1 = window.document.getElementById(event.target.id);
    img1.style.top = "0";
  };

  var left = 0;
  for (var i = 0; i < hand.length; i++) {
   left += 20;
   var img = window.document.createElement("img");
   img.id = hand[i].toString();
   img.style.position = "absolute";
   img.style.left = (left + "px");
   img.style.top = "0";
   img.style.width = "71px";
   img.style.height = "96px";
   img.style.zIndex = i;
   img.style.height = "96px";
   img.style.zIndex = i.toString();
   img.setAttribute("src", hand[i].getURL());
   img.setAttribute("alt", hand[i].toString());
   img.addEventListener("click", humanSelect, false);
   img.addEventListener("mouseover", onRollOver, false);
   img.addEventListener("mouseleave", offRollOver, false);
   playerHand.appendChild(img);
 }
 return;
};


View.prototype.addCardPlayerHand = function(card){
    var pres = this.presenter;
    var onRollOver = function(event) {
      var img1 = window.document.getElementById(event.target.id);
      img1.style.top = "-15px";
    };
    var offRollOver = function(event) {
      var img1 = window.document.getElementById(event.target.id);
      img1.style.top = "0";
    };
    var humanSelect = function(event) {
      var img1 = window.document.getElementById(event.target.id);
      img1.style.top = "0";
      img1.removeEventListener("mouseover", onRollOver);
      img1.removeEventListener("mouseleave", offRollOver);
      pres.playCard(event.target.alt);
    };
    var hand = window.document.getElementById("playerHand");
    var left = 20 + 20*(hand.childNodes.length); //get the position for the new card to be added
    var img = window.document.createElement("img");
    img.id = card.toString();
    img.style.position = "absolute";
    img.style.left = (left + "px");
    img.style.top = "0";
    img.style.width = "71px";
    img.style.height = "96px";
    img.style.zIndex = (hand.childNodes.length + 1).toString();
    img.style.height = "96px";
    img.setAttribute("src", card.getURL());
    img.setAttribute("alt", card.toString());
    img.addEventListener("click", humanSelect, false);
    img.addEventListener("mouseover", onRollOver, false);
    img.addEventListener("mouseleave", offRollOver, false);
    hand.appendChild(img);
};

View.prototype.addCardComputerHand = function(card){
    var hand = window.document.getElementById("computerHand");
    var left = 20 + 20*(hand.childNodes.length); //get the position for the new card to be added
    var img = window.document.createElement("img");
    img.setAttribute("src", "../images/PlayingCards/back.png");
    img.setAttribute("alt", "Card Back");
    img.style.position = "absolute";
    img.style.left = (left + "px");
    img.style.top = "0";
    img.style.width = "71px";
    img.style.height = "96px";
    img.style.zIndex = (hand.childNodes.length + 1).toString();
    img.style.height = "96px";
    hand.appendChild(img);
};


/**
 * Display the suit picker.
 */
View.prototype.displaySuitPicker = function(hand) {
	var suitMenu = window.document.getElementById("suitMenu");
	suitMenu.style.display="block";
  return;
};

/**
 * This function removes everything from the current table
 * and calls displayTable with the new top card.
 * @param  {Card} topCard [The card to be put on the table]
 */
View.prototype.updateTable = function (topCard) {

  //remove everything from the current table and re-add it
  var table = window.document.getElementById("table");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  this.displayTable(topCard);
};

/**
 * Announce that human has won and when they click the prompt refresh the page
 * so that they can play again.
 */
 View.prototype.announceHumanWinner = function() {
  window.alert("Congratulations... you can beat the computer on " + this.presenter.difficultyLevel + ".");
  window.location.reload(false);
  return;
};

/**
 * Announce that I have won and when they click the prompt refresh the page
 * so that they can play again.
 */
 View.prototype.announceComputerWinner = function() {
  window.alert("Well, the computer has won this time. Maybe you can get the next one. ");
  window.location.reload(false);
  return;
};

/**
 * Set an event listener on the buttonAnnounce that I have won and
 * when they click the prompt refresh the page so that they can play again.
 */
View.prototype.setRuleListener= function(){
   //set an event listener for if the button for the rules is clicked
   //when it is clicked, display the div that has id ruleReference
  var ruleOpenSelect = function(event) {
    var ruleReference = window.document.getElementById("ruleReference");
    ruleReference.style.display="inline-block";
    var button1 = window.document.getElementById("ruleopen");
    button1.style.display="none";
  };
  var ruleCloseSelect = function(event) {
    var ruleReference = window.document.getElementById("ruleReference");
    ruleReference.style.display="none";
    var button1 = window.document.getElementById("ruleopen");
    button1.style.display="inline-block";
  };
   var button1 = window.document.getElementById("ruleopen");
   button1.addEventListener("click", ruleOpenSelect, false);
   var button2 = window.document.getElementById("ruleclose");
   button2.addEventListener("click", ruleCloseSelect, false);
};


/**
 * Set an event listener on the the forfeit button so that
 * if they select the button, it refreshes the game so that
 * a new game can be played.
 */
View.prototype.setForfeitListener = function(){
   var forfeitSelect = function(event) {
      window.alert("Well, I guess you are letting the computer win...");
      window.location.reload(false);
   }
   var button = window.document.getElementById("forfeit");
   button.addEventListener("click",forfeitSelect,false);
};

/**
 * /
 * @return {String choice} [The difficulty that the user selected in the
 * dropdown menu.]
 */
View.prototype.getDifficulty = function() {
  var e = document.getElementById("difficulty_select");
  if(e == null) {
    choice = this.presenter.difficultyLevel;
  } else {
    var choice = e.options[e.selectedIndex].value;
  }
  // var cssRuleCode = document.all ? 'rules' : 'cssRules'; //account for IE and FF
  // var rule = document.styleSheets[styleIndex][cssRuleCode][ruleIndex];
  // var selector = rule.'choice';  //maybe '#tId'
  // var value = rule.value;            //both selectorText and value are settable.
  return choice;
};

/**
 * This function adds an event listener to the div that contains the
 * game itself (divs for player hand, computer hand, and the table).
 */
View.prototype.setStartGameListener = function(){
  var pres = this.presenter;
  var self = this;
    var startGameSelect = function(event) {
      var menu = window.document.getElementById("before_game");
      menu.style.display='none';
      var game = window.document.getElementById("game_start");
      game.style.display='block';
      pres.difficultyLevel = self.getDifficulty();
      if(pres.difficultyLevel == 'select') {
        window.alert("You must select a difficulty level.");
        window.location.reload(false);
      }
   }
   var button = window.document.getElementById("start_button");
   button.addEventListener("click", startGameSelect,false);
};


