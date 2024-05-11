'use strict';

const app = function () {
  const game = {};
  const suits = ["spades", "hearts", "clubs", "diams"];
  const ranks = ["A", 10, 10, 10];
  const score = [0, 0];

  const init = () => {
    const initialCash = 100;
    const initialBet = 0;

    game.cash = initialCash;
    game.bet = initialBet;
    
    buildGameBoard();
    turnOff(game.btnHit);
    turnOff(game.btnStand);
    buildDeck();
    addClicker();
    scoreBoard();
    updateCash();
  };
  
  const updateCash = () => {
    const inputValue = parseInt(game.inputBet.value);
    const minBet = 0;
  
    if (isNaN(inputValue) || inputValue <= minBet) {
      game.inputBet.value = minBet;
    } else if (inputValue > game.cash) {
      game.inputBet.value = game.cash;
    }
  
    game.bet = inputValue;
    game.playerCash.textContent = `Player Cash $${game.cash - game.bet}`;
  };

  const lockWager = (toggle) => {
    const disabledColor = "#ddd";
    const enabledColor = "#000";
    const inputBackgroundColor = toggle ? disabledColor : "#fff";
    const buttonBackgroundColor = toggle ? disabledColor : enabledColor;
  
    game.inputBet.disabled = toggle;
    game.betButton.disabled = toggle;
    game.inputBet.style.backgroundColor = inputBackgroundColor;
    game.betButton.style.backgroundColor = buttonBackgroundColor;
  };

  const setBet = () => {
    const betAmount = game.bet;
    game.status.textContent = `You bet $${betAmount}`;
    game.cash -= betAmount;
    game.playerCash.textContent = `Player Cash $${game.cash}`;
    lockWager(true);
  };

  const scoreBoard = () => {
    const dealerScore = score[0];
    const playerScore = score[1];
    game.scoreboard.textContent = `Dealer ${dealerScore} vs Player ${playerScore}`;
  };

  const addClicker = () => {
    game.btnDeal.addEventListener('click', deal);
    game.btnStand.addEventListener('click', playerStand);
    game.btnHit.addEventListener('click', nextCard);
    game.betButton.addEventListener('click', setBet);
    game.inputBet.addEventListener('change', updateCash);
  };
  
  const deal = () => {
    game.dealerHand = [];
    game.playerHand = [];
    game.dealerScore.textContent = "*";
    game.start = true;
    lockWager(true);
    turnOff(game.btnDeal);
    game.playerCards.innerHTML = "";
    game.dealerCards.innerHTML = "";
    
    // Dealer takes first card face down and second card face up
    takeCard(game.dealerHand, game.dealerCards, true);
    takeCard(game.dealerHand, game.dealerCards, false);

    // Player takes two cards face up
    takeCard(game.playerHand, game.playerCards, false);
    takeCard(game.playerHand, game.playerCards, false);
    
    updateCount();
  };

  const nextCard = () => {
    takeCard(game.playerHand, game.playerCards, false);
    updateCount();
  };

  const playerStand = () => {
    dealerPlay();
    turnOff(game.btnHit);
    turnOff(game.btnStand);
  };

  function findWinner() {
    let player = scorer(game.playerHand);
    let dealer = scorer(game.dealerHand);
    console.log(player, dealer);
    if (player > 21) {
      game.status.textContent = "You Busted with " + player + " ";
    }
    if (dealer > 21) {
      game.status.textContent = "Dealer Busted with " + dealer + " ";
    }
    if (player == dealer) {
      game.status.textContent = "Draw no winners " + player + " ";
    }
    else if ((player < 22 && player > dealer) || dealer > 21) {
      game.status.textContent += "You Win with " + player + " ";
      score[1]++;
    }
    else {
      game.status.textContent += "Dealer wins with " + dealer + " ";
      score[0]++;
    }
    if (game.cash < 1) {
      game.cash = 0;
      game.bet = 0;
    }
    scoreBoard();
    game.playerCash.textContent = "Player Cash $" + game.cash;
    lockWager(false);
    turnOff(game.btnHit);
    turnOff(game.btnStand);
    turnOn(game.btnDeal);
  }

  const dealerPlay = () => {
    const dealerScore = scorer(game.dealerHand);
    game.cardBack.style.display = "none";
    game.status.textContent = `Dealer score ${dealerScore} `;
    
    if (dealerScore >= 17) {
        game.dealerScore.textContent = dealerScore;
        findWinner();
    } else {
        takeCard(game.dealerHand, game.dealerCards, false);
        game.dealerScore.textContent = dealerScore;
        dealerPlay();
    }
  };

  function updateCount() {
    let player = scorer(game.playerHand);
    let dealer = scorer(game.dealerHand);
    game.playerScore.textContent = player;
    if (player < 21){
      turnOn(game.btnHit);
      turnOn(game.btnStand);
      game.status.textContent = "Stand or take another card";
    }
    else if (player > 21) {
      findWinner();
    }
    else {
      game.status.textContent = "Dealer in PLay to 17 minimum";
      dealerPlay(dealer);
    }
    if (dealer == 21 && game.dealerHand.length == 2) {
      game.status.textContent = "Dealer Got BlackJack";
      gameEnd();
      findWinner();
    }
  }

  const countTotal = (hand) => {
    let total = 0;
    for (const card of hand) {
      total += Number(card.value);
    }
    return total;
  };
  
  const countAces = (hand) => {
    let aceCount = 0;
    for (const card of hand) {
      if (card.rank === "A") {
        aceCount++;
      }
    }
    return aceCount;
  };

  const adjustScoreForAces = (totalScore, numberOfAces) => {
    for (let i = 0; i < numberOfAces && totalScore > 21; i++) {
      totalScore -= 10;
    }
    return totalScore;
  };

  const scorer = (hand) => {
    let total = countTotal(hand);
    let aceCount = countAces(hand);
  
    total = adjustScoreForAces(total, aceCount);
  
    if (total > 21) {
      gameEnd();
    }
  
    return total;
  };

  const gameEnd = () => {
    game.cardBack.style.display = "none";
    turnOff(game.btnHit);
    turnOff(game.btnStand);
  };

  const takeCard = (hand, element, showCardBack) => {
    if (game.deck.length === 0) {
      buildDeck();
    }
  
    const newCard = game.deck.shift();
    hand.push(newCard);
    showCard(newCard, element);
  
    if (showCardBack) {
      const cardBack = document.createElement('div');
      cardBack.classList.add('cardB');
      game.cardBack = cardBack; 
      element.append(cardBack);
    }
  };

  const createCardElement = (card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add('card');
    
    if (card.suit === "hearts" || card.suit === "diams") {
      cardElement.classList.add('red');
    }
    
    return cardElement;
  };
  
  const addRankAndSuit = (cardElement, card) => {
    const rankAndSuit = document.createElement('div');
    rankAndSuit.innerHTML = `${card.rank}&${card.suit};`;
    rankAndSuit.classList.add('tiny');
    cardElement.appendChild(rankAndSuit);
  };
  
  const addRank = (cardElement, card) => {
    const rank = document.createElement('div');
    rank.innerHTML = card.rank;
    rank.classList.add('big');
    cardElement.appendChild(rank);
  };
  
  const addSuitSymbol = (cardElement, card) => {
    const suitSymbol = document.createElement('div');
    suitSymbol.innerHTML = `&${card.suit};`;
    suitSymbol.classList.add('big');
    cardElement.appendChild(suitSymbol);
  };
  
  const showCard = (card, containerElement) => {
    if (card) {
      containerElement.style.backgroundColor = "white";
      const cardElement = createCardElement(card);
      addRankAndSuit(cardElement, card);
      addRank(cardElement, card);
      addSuitSymbol(cardElement, card);
      containerElement.appendChild(cardElement);
    }
  };
  
  const turnOff = (button) => {
    button.disabled = true;
    button.style.backgroundColor = "#ddd";
  };

  const turnOn = (button) => {
    button.disabled = false;
    button.style.backgroundColor = "#000";
  };
  
  const buildDeck = () => {
    game.deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        let card = {};
        let tempValue = isNaN(rank) ? 10 : rank;
        tempValue = (rank === "A") ? 11 : tempValue;
        card.suit = suit;
        card.rank = rank;
        card.value = tempValue;
        game.deck.push(card);
      }
    }
    shuffleCards(game.deck);
  };

  const shuffleCards = (cards) => cards.sort(() => Math.random() - 0.5);

  const buildGameBoard = () => {
    game.main = document.querySelector('#game');
    
    // Scoreboard
    game.scoreboard = document.createElement('div');
    game.scoreboard.textContent = "Dealer 0 vs Player 0";
    game.scoreboard.classList.add('score');
    game.main.append(game.scoreboard);
    
    // Table setup
    game.table = document.createElement('div');
    game.table.classList.add('table');
    
    // Dealer section
    game.dealer = document.createElement('div');
    game.dealer.classList.add('dealer');
    
    game.dealerCards = document.createElement('div');
    game.dealerCards.textContent = "DEALER CARD";
    
    game.dealerScore = document.createElement('div');
    game.dealerScore.textContent = "-";
    game.dealerScore.classList.add('score');
    
    game.dealer.append(game.dealerScore, game.dealerCards);
    game.table.append(game.dealer);
    
    // Player section
    game.player = document.createElement('div');
    game.player.classList.add('player');
    
    game.playerCards = document.createElement('div');
    game.playerCards.textContent = "PLAYER CARD";
    
    game.playerScore = document.createElement('div');
    game.playerScore.textContent = "-";
    game.playerScore.classList.add('score');
    
    game.player.append(game.playerScore, game.playerCards);
    game.table.append(game.player);
    
    // Dashboard
    game.dashboard = document.createElement('div');
    game.dashboard.classList.add('dashboard');
    
    game.status = document.createElement('div');
    game.status.classList.add('message');
    game.status.textContent = "Message for Player";
    
    game.btnDeal = createButton("DEAL", "btn");
    game.btnHit = createButton("HIT", "btn");
    game.btnStand = createButton("STAND", "btn");
    game.betButton = createButton("Bet Amount", "btn");
    
    game.playerCash = document.createElement('div');
    game.playerCash.classList.add('message');
    game.playerCash.textContent = "Player Cash $100";
    
    game.inputBet = document.createElement('input');
    game.inputBet.setAttribute('type', 'number');
    game.inputBet.style.width = "4em";
    game.inputBet.style.fontSize = "1.4em";
    game.inputBet.style.marginTop = "1em";
    game.inputBet.value = 0;
    
    game.dashboard.append(game.status, game.btnDeal, game.btnHit, game.btnStand, game.playerCash, game.inputBet, game.betButton);
    
    game.table.append(game.dashboard);
    game.main.append(game.table);
  };

  const createButton = (text, className) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    return button;
  };
  return {
    init: init
  }
}();
