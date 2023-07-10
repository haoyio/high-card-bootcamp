import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./App.css";
import { makeShuffledDeck, suitToSymbol } from "./utils.js";

class App extends React.Component {
  constructor(props) {
    // Always call super with props in constructor to initialise parent class
    super(props);
    this.numPlayers = props.numPlayers > 2 ? props.numPlayers : 2; // handles multi-player games
    this.state = {
      // Set default value of card deck to new shuffled deck
      cardDeck: makeShuffledDeck(),
      // historyCards holds the cards from all rounds
      historyCards: [],
      historyWinner: [],
    };
  }

  dealCards = () => {
    // don't bother if we've run out of cards
    if (this.state.cardDeck.length < this.numPlayers) return;

    // this.state.cardDeck.pop() modifies this.state.cardDeck array
    const newCards = [];
    let newWinner = -1;
    let maxRank = 0;

    // deal cards
    for (let i = 0; i < this.numPlayers; i++) {
      const newCard = this.state.cardDeck.pop();
      newCards.push(newCard);
      if (newCard.rank > maxRank) {
        maxRank = newCard.rank;
        newWinner = i;
      } else if (newCard.rank === maxRank) {
        newWinner = -1;  // draw aka no winner
      }
    }

    const newHistoryCards = this.state.historyCards.slice();
    newHistoryCards.push(newCards);

    const newHistoryWinner = this.state.historyWinner.slice();
    newHistoryWinner.push(newWinner);

    this.setState({
      historyCards: newHistoryCards,
      historyWinner: newHistoryWinner,
    });

  };

  render() {

    const playerRow = [];
    for (let i = 0; i < this.numPlayers; i++) {
      playerRow.push(<TableCell align="center">Player {i + 1}</TableCell>)
    }

    const headRow = (
      <TableRow>
        <TableCell>Turn</TableCell>
        {playerRow}
        <TableCell>Winner</TableCell>
      </TableRow>
    );

    const historyCardElems = this.state.historyCards.map((turnCards, turnIndex) => (
      <TableRow>
        <TableCell>{turnIndex + 1}</TableCell>
        {turnCards.map(({ name, suit }) =>
          <TableCell align="center">{name}{suitToSymbol(suit)}</TableCell>
        )}
        <TableCell>{this.state.historyWinner[turnIndex] >= 0 ? `Player ${this.state.historyWinner[turnIndex] + 1}` : "Draw"}</TableCell>
      </TableRow>
    ));

    let dealOrEndGame;
    if (this.state.cardDeck.length >= this.numPlayers) {
      dealOrEndGame = <button onClick={this.dealCards}>Deal</button>;
    } else {
      // count how many times each player has won
      const counts = {};
      for (const winner of this.state.historyWinner) {
        counts[winner] = counts[winner] ? counts[winner] + 1 : 1;
      }

      // determine winner(s); may have multiple in cases of ties
      let winners = [];
      let maxWins = 0;
      for (let i = 0; i < this.numPlayers; i++) {
        if (counts[i] > maxWins) {
          maxWins = counts[i];
          winners = [];
          winners.push(i + 1); // 1-indexing
        } else if (counts[i] === maxWins) {
          winners.push(i + 1); // 1-indexing
        }
      }

      dealOrEndGame = <h4>Winner{winners.length > 1 ? "s" : ""}: Player {winners.join(", Player ")}</h4>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h3>High Card 🚀</h3>
          {dealOrEndGame}
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                {headRow}
              </TableHead>
              <TableBody>
                {historyCardElems}
              </TableBody>
            </Table>
          </TableContainer>
        </header>
      </div>
    );
  }
}

export default App;
