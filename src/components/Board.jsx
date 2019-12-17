import React, { Component } from "react";
import Square from "./Square";
import "../styles/Board.css";
import { gameStatuses, noFlags, remainingFlags, messages } from "../globConstants/globConstants";

class Board extends Component {
  state = {
    boardData: [],
    remainingFlags: remainingFlags,
    gameStatus: gameStatuses.INPROGRESS
  };

  constructor(props) {
    super(props);
    const { height, width, mines } = props;
    this.state.remainingFlags = mines;
    this.state.boardData = this.initializeBoardData(height, width, mines);
  }

  initializeBoardData = (height, width, mines) => {
    let newBoardData = [];
    for (let row = 0; row < height; row++) {
      newBoardData.push([]);
      for (let col = 0; col < width; col++) {
        newBoardData[row].push({
          rowNum: row,
          colNum: col,
          isExposed: false,
          isFlagged: false,
          isMine: false,
          minesNeighbors: 0
        });
      }
    }
    this.setRandomMines(newBoardData, mines, height, width);
    this.setNeighborsMinesSum(newBoardData, height, width);
    return newBoardData;
  };

  setRandomMines = (boardData, mines, height, width) => {
    const newBoardData = boardData;
    for (let i = 0; i < mines; i++) {
      const rowRandomIndex = Math.floor(Math.random() * height);
      const colRandomIndex = Math.floor(Math.random() * width);
      if (newBoardData[rowRandomIndex][colRandomIndex].isMine) {
        i--;
      } else {
        newBoardData[rowRandomIndex][colRandomIndex].isMine = true;
      }
    }
    return newBoardData;
  };

  getSquareNeighbors = (row, col, boardData, height, width) => {
    const squareNeighbors = [];
    if (row - 1 >= 0) 
      squareNeighbors.push(boardData[row - 1][col]);
    if (row + 1 < height)
      squareNeighbors.push(boardData[row + 1][col]);
    if (col + 1 < width)
      squareNeighbors.push(boardData[row][col + 1]);
    if (col - 1 >= 0)
      squareNeighbors.push(boardData[row][col - 1]);
    if (row - 1 >= 0 && col + 1 < width)
      squareNeighbors.push(boardData[row - 1][col + 1]);
    if (row - 1 >= 0 && col - 1 >= 0)
      squareNeighbors.push(boardData[row - 1][col - 1]);
    if (row + 1 < height && col + 1 < width)
      squareNeighbors.push(boardData[row + 1][col + 1]);
    if (row + 1 < height && col - 1 >= 0)
      squareNeighbors.push(boardData[row + 1][col - 1]);
    return squareNeighbors;
  };

  setNeighborsMinesSum = (boardData, height, width) => {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const squareData = boardData[row][col];
        if (squareData.isMine === false) {
          let mineNum = 0;
          const squareNeighbors = this.getSquareNeighbors(row, col, boardData, height, width);
          squareNeighbors.forEach(neighbor => {
            if (neighbor.isMine)
              mineNum++;
          });
          boardData[row][col].minesNeighbors = mineNum;
        }
      }
    }
    return boardData;
  };

  exposeAllSquares = newRemainingFlags => {
    const { boardData } = this.state;
    const newBoardData = boardData.map(row => row.slice());
    newBoardData.forEach(row => {
      row.forEach(square => {
        square.isExposed = true;
      });
    });
    this.setState({ boardData: newBoardData, remainingFlags: newRemainingFlags });
  };

  // Recursive implementation
  // exposeEmptySquare = (row, col, boardData) => {
  //   const squareNeighbors = this.getSquareNeighbors(row, col, boardData, this.props.height, this.props.width);
  //   squareNeighbors.forEach(square => {
  //     if (!square.isExposed && (square.minesNeighbors === 0 || !square.isMine) && !square.isFlagged) {
  //       boardData[square.rowNum][square.colNum].isExposed = true;
  //       if (square.minesNeighbors === 0)
  //         this.exposeEmptySquare(square.rowNum, square.colNum, boardData);
  //     }
  //   });
  //   return boardData;
  // };

  // Iterative implementation
  exposeEmptySquare = (row, col, boardData) => {
    let callStack = [];
    callStack.push([row, col]);
    while (callStack.length > 0) {
      let square = callStack.pop();
      const squareNeighbors = this.getSquareNeighbors(square[0], square[1], boardData, this.props.height, this.props.width);
      squareNeighbors.forEach(square => {
        if (!square.isExposed && (square.minesNeighbors === 0 || !square.isMine) && !square.isFlagged) {
          boardData[square.rowNum][square.colNum].isExposed = true;
          if (square.minesNeighbors === 0)
            callStack.push([square.rowNum, square.colNum]);
        }
      });
    }
    return boardData;
  };

  isFlagsEqualMines = () => {
    const { boardData } = this.state;
    let flagsEqualMines = 0;
    boardData.forEach(row => {
      row.forEach(square => {
        if (square.isFlagged && square.isMine) flagsEqualMines++;
      });
    });
    if (flagsEqualMines === this.props.mines) return true;
    return false;
  };

  handleSquareClick = (e, row, col) => {
    if (e.shiftKey) {
      this.handleShiftAndClick(row, col);
    } else {
      this.handleLeftClick(row, col);
    }
  };

  handleLeftClick = (row, col) => {
    const { boardData, remainingFlags, gameStatus } = this.state;
    if (boardData[row][col].isFlagged || boardData[row][col].isExposed || gameStatus !== gameStatuses.INPROGRESS)
      return null;

    if (boardData[row][col].isMine) {
      this.exposeAllSquares(remainingFlags);
      //alert(gameStatuses.LOSE);
      this.setState({ gameStatus: gameStatuses.LOSE, remainingFlags: 0 });
      return null;
    }

    let newBoardData = boardData.map(row => row.slice());
    newBoardData[row][col].isExposed = true;
    if (newBoardData[row][col].minesNeighbors === 0)
      newBoardData = this.exposeEmptySquare(row, col, newBoardData);
    this.setState({ boardData: newBoardData });
  };

  handleShiftAndClick = (row, col) => {
    const { boardData, gameStatus } = this.state;
    if (boardData[row][col].isExposed || gameStatus !== gameStatuses.INPROGRESS)
      return null;
    const { remainingFlags } = this.state;
    let newBoardData = boardData.map(row => row.slice());
    let newRemainingFlags = remainingFlags;
    if (newBoardData[row][col].isFlagged) {
      newBoardData[row][col].isFlagged = false;
      newRemainingFlags++;
    } else {
      if (remainingFlags === 0) {
        alert(noFlags);
        return null;
      }
      if (newRemainingFlags > 0) {
        newBoardData[row][col].isFlagged = true;
        newRemainingFlags--;
        if (newRemainingFlags === 0) {
          if (this.isFlagsEqualMines()) {
            //alert(gameStatuses.WIN);
            this.setState({
              gameStatus: gameStatuses.WIN,
              remainingFlags: newRemainingFlags
            });
            return null;
          }
        }
      } else return null;
    }
    this.setState({
      boardData: newBoardData,
      remainingFlags: newRemainingFlags
    });
  };

  setGameStatusMessage = gameStatus => {
    if (gameStatus === gameStatuses.WIN) {
      return messages.WIN;
    } else if (gameStatus === gameStatuses.LOSE) {
      return messages.LOSE;
    }
    return messages.INPROGRESS;
  };

  renderBoard = boardData => {
    return (
      <div className="board">
        {boardData.map((row, rowIndex) => (
          <div key={"row" + rowIndex} className="row">
            {row.map(square => (
              <Square
                key={row.length * square.rowNum + square.colNum}
                square={square}
                onSquareClick={e =>
                  this.handleSquareClick(e, square.rowNum, square.colNum)
                }
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  componentDidUpdate = prevProps => {
    // updateing board settings when props are changing
    const { height, width, mines, gameNum } = this.props;
    if (height !== prevProps.height || width !== prevProps.width || mines !== prevProps.mines || gameNum !== prevProps.gameNum) {
      const newBoardData = this.initializeBoardData(height, width, mines);
      this.setState({ boardData: newBoardData, remainingFlags: mines, gameStatus: gameStatuses.INPROGRESS });
    }
  };

  render() {
    const { boardData, gameStatus, remainingFlags } = this.state;
    return (
      <React.Fragment>
        <span className="remainingFlags">
          Remaining flags: <span className="flags">{remainingFlags} </span>
        </span>
        <span className="status">
          Game status: {this.setGameStatusMessage(gameStatus)}{" "}
        </span>
        {this.renderBoard(boardData)}
      </React.Fragment>
    );
  }
}

export default Board;
