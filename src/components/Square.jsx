import React, { Component } from "react";
import "../styles/Square.css";
import { icons } from "../globConstants/globConstants";

class Square extends Component {
  getSquareValueAndClass = () => {
    const { square } = this.props;
    if (!square.isExposed) {
      if (square.isFlagged) {
        return [icons.FLAG, "square square-flagged"]; //
      } else {
        return [".", "square"];
      }
    }
    if (square.isMine) return [icons.BOMB, "square square-boom"];
    if (square.minesNeighbors === 0) return [".", "square square-exposed"];
    return [square.minesNeighbors, "square square-exposed-number"];
  };

  render() {
    const { square, onSquareClick } = this.props;
    const [squareValue, squareClassName] = this.getSquareValueAndClass();
    return (
      <button
        className={squareClassName}
        onClick={e => onSquareClick(e, square.rowNum, square.colNum)}
      >
        {squareValue}
      </button>
    );
  }
}

export default Square;
