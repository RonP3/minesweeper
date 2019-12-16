import React, { Component } from "react";
import Toolbar from "./components/Toolbar";
import Board from "./components/Board";
import "./styles/Minesweeper.css";
import { initialBoardSettings } from "./globConstants/globConstants";

class Minesweeper extends Component {
  state = {
    height: initialBoardSettings.HEIGHT,
    width: initialBoardSettings.WIDTH,
    mines: initialBoardSettings.MINES,
    gameNum: initialBoardSettings.GAMENUM
  };

  handleBoardSettingsChange = (height, width, mines) => {
    let newGameNum = this.state.gameNum + 1;
    if (height <= 0 || width <= 0 || mines < 0 || width > 300 || height > 300) {
      alert("Invalid input! Width and height should be in range [1-300]");
      return null;
    }
    if (mines > height * width || mines === 0) {
      alert("Number of mines should be in range [1 - board dimension]");
      return null;
    }
    this.setState({
      height: height,
      width: width,
      mines: mines,
      gameNum: newGameNum
    });
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
