"use strict";

/**
 * Deck of playing cards.
 */
function Deck() {
  /**
   * Construct this Deck.
   */
  var suit = ["c", "d", "h", "s"];
  var value = ["2", "3", "4", "5", "6", "7", "8", "9", "10",
               "j", "q", "k", "a"];
  this.list = new Array();
  for (var i=0; i<suit.length; i++) {
    for (var j=0; j<value.length; j++) {
      this.list.push(new Card(suit[i],value[j]));
    }
  }
  // Use a seeded pseudo-random number generator if
  // a "seed" parameter with numeric value is present in the URL,
  // otherwise use the built-in Math prng.
  var params = window.location.search.split(/[?=&]/);
  var ind = params.indexOf("seed");
  // If we found a parameter named "seed", use its value as prng seed.
  // (We look for an odd index because params[0] will be the empty string
  // since the search string begins with '?', so parameter names will be
  // at 1, 3, etc.)
  if (ind>=0 && ind%2==1) {
    var seed = Number(params[ind+1]);
    if (seed) { 
      this.prng = new xorshift(seed);
    }
    else {
      this.prng = Math;
    }
  }
  else {
    this.prng = Math;
  }
}
Deck.prototype = {
  /**
   * Shuffle the deck.
   */
  shuffle: function () {
    for (var n=this.list.length; n>=2; n--) {
      var r = Math.floor(this.prng.random()*n);
      // Swap cards at r and n-1
      var card = this.list[r];
      this.list[r] = this.list[n-1];
      this.list[n-1] = card;
    }
  },

  /**
   * Remove top card from the deck and return it.
   */
  dealACard: function () {
    return this.list.shift();
  },

  /**
   * Indicate whether or not top card of deck is an 8.
   * This method is intended to be used only during game
   * initialization to avoid starting the pile with an 8.
   */
  isTopCardAnEight: function () {
    return this.list[0].getValue() == "8";
  }
};
