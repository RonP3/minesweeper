export const icons = {
  FLAG: "⚑",
  BOMB: "💣"
};

export const gameStatuses = {
  INPROGRESS: "In progress",
  WIN: "Win!",
  LOSE: "Lose!"
};

export const messages = {
  INPROGRESS: "In progress 💣",
  WIN: "Win! 🚩",
  LOSE: "Lose! 🔥"
};

export const initialBoardSettings = {
  HEIGHT: 10,
  WIDTH: 10,
  MINES: 5,
  GAMENUM: 0
};

export const errorMessages = {
  INVALID_DIMENSION: "Invalid input! Width and height should be in range [1-300]",
  INVALID_MINES: "Number of mines should be in range [1 - board dimension]"
};

export const maxBoardDimension = 300;
export const noFlags = "No more flags!";
export const remainingFlags = 0;
