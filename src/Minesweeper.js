import React, { Component } from "react";
import Toolbar from "./components/Toolbar";
import Board from "./components/Board";
import "./styles/Minesweeper.css";
import { initialBoardSettings, errorMessages, maxBoardDimension } from "./globConstants/globConstants";

class Minesweeper extends Component {
  state = {
    height: initialBoardSettings.HEIGHT,
    width: initialBoardSettings.WIDTH,
    mines: initialBoardSettings.MINES,
    gameNum: initialBoardSettings.GAMENUM
  };

  handleBoardSettingsChange = (height, width, mines) => {
    let newGameNum = this.state.gameNum + 1;
    if (height <= 0 || width <= 0 || mines < 0 || width > maxBoardDimension || height > maxBoardDimension) {
      alert(errorMessages.INVALID_DIMENSION);
      return null;
    }
    if (mines > height * width || mines === 0) {
      alert(errorMessages.INVALID_MINES);
      return null;
    }
    this.setState({ height: height, width: width, mines: mines, gameNum: newGameNum });
  };

  render() {
    const { height, width, mines, gameNum } = this.state;
    return (
      <div className="root">
        <Toolbar onBoardSettingsChange={this.handleBoardSettingsChange} />
        <Board height={height} width={width} mines={mines} gameNum={gameNum} />
      </div>
    );
  }
}

export default Minesweeper;
