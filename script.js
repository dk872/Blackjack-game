'use strict';

const app = function () {
  const game = {};
  
  function init() {
    console.log('init ready');
    game.main = document.querySelector('#game');
    console.log(game);
    game.scoreboard = document.createElement('div');
    game.scoreboard.textContent = "Dealer 0 vs Player 0";
    game.scoreboard.style.fontSize = "2em";
    game.main.append(game.scoreboard);

    game.table = document.createElement('div');
    game.dealer = document.createElement('div');
    game.dealerCards = document.createElement('div');
    game.dealerCards.textContent = "DEALER CARD";
    game.dealerScore = document.createElement('div');
    game.dealerScore.textContent = "-";
    game.dealerScore.classList.add('score');
    game.dealer.append(game.dealerScore);
    game.table.append(game.dealer);
    game.dealer.append(game.dealerCards);

    game.player = document.createElement('div');
    game.playerCards = document.createElement('div');
    game.playerCards.textContent = "PLAYER CARD";
    game.playerScore = document.createElement('div');
    game.playerScore.textContent = "-";
    game.playerScore.classList.add('score');
    game.player.append(game.playerScore);
    game.table.append(game.player);
    game.player.append(game.playerCards);

  }
  return {
    init: init
  }
}();
