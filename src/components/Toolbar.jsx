import React, { Component } from "react";
import "../styles/Toolbar.css";
import { initialBoardSettings } from "../globConstants/globConstants";

class Toolbar extends Component {
  state = {
    heightInput: initialBoardSettings.HEIGHT,
    widthInput: initialBoardSettings.WIDTH,
    mineInput: initialBoardSettings.MINES
  };

  isNumber = val => {
    const re = /^[0-9\b]+$/;
    if (re.test(val) || val === "") return true;
    return false;
  };

  handleHeightChange = input => {
    let height = input.target.value;
    if (this.isNumber(height)) {
      height = Number(height);
      this.setState({ heightInput: height });
    }
  };

  handlewidthChange = input => {
    let width = input.target.value;
    if (this.isNumber(width)) {
      width = Number(width);
      this.setState({ widthInput: width });
    }
  };

  handleMinesChange = input => {
    let mines = input.target.value;
    if (this.isNumber(mines)) {
      mines = Number(mines);
      this.setState({ mineInput: mines });
    }
  };

  render() {
    return (
      <div>
        <div className="Height">
          <label>Height:</label>
          <input placeholder="Height" key="height" onChange={this.handleHeightChange} type="text" value={this.state.heightInput}></input>
        </div>
        <div className="Width">
          <label>Width:</label>
          <input
            key="width" onChange={this.handlewidthChange} type="text" value={this.state.widthInput}></input>
        </div>
        <div className="Mines">
          <label>Mines:</label>
          <input
            key="mines" onChange={this.handleMinesChange} type="text" value={this.state.mineInput}></input>
        </div>
        <div className="newGame">
          <button onClick={() => this.props.onBoardSettingsChange(this.state.heightInput, this.state.widthInput, this.state.mineInput)}>
            New Game
          </button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
