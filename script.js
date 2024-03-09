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
    
    game.dashboard = document.createElement('div');
    game.status = document.createElement('div');
    game.status.classList.add('message');
    game.status.textContent = "Message for Player";
    game.dashboard.append(game.status);

    game.btnDeal = document.createElement('button');
    game.btnDeal.textContent = "DEAL";
    game.btnDeal.classList.add('btn');
    game.dashboard.append(game.btnDeal);

    game.btnHit = document.createElement('button');
    game.btnHit.textContent = "HIT";
    game.btnHit.classList.add('btn');
    game.dashboard.append(game.btnHit);

    game.btnStand = document.createElement('button');
    game.btnStand.textContent = "STAND";
    game.btnStand.classList.add('btn');
    game.dashboard.append(game.btnStand);

    game.playerCash = document.createElement('div');
    game.playerCash.classList.add('message');
    game.playerCash.textContent = "Player Cash $100";
    game.dashboard.append(game.playerCash);
    
    game.table.append(game.dashboard);
    game.main.append(game.table);
  }
  return {
    init: init
  }
}();
