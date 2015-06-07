var globals = {};

globals.TIE_GAME = 'tie';

globals.playerX = "playerX";
globals.playerO = "playerO";

globals.playerXdefaultDisplayName = "Player X";
globals.playerOdefaultDisplayName = "Player O";

globals.solutions = {
    '0': [
        [1,2], // row0
        [3,6], // column0
        [4,8] // diagonal
    ],
    '1': [
        [0,2], // row0
        [4,7] // column1
    ],
    '2': [
        [0,1], // row0
        [5,8], // column2
        [6,4] // reverse diagonal
    ],
    '3': [
        [0,6], // row1
        [4,5], // column0
    ],
    '4': [
        [3,5], // row1
        [0,8], // column1
        [6,2], // diagonal
        [0,8] // reverse diagonal
    ],
    '5': [
        [3,4], // row2
        [2,8], // column2
    ],
    '6': [
        [7,8], // row2
        [0,3], // column0
        [4,2] // reverse diagonal
    ],
    '7': [
        [6,8], // row2
        [1,4], // column1
    ],
    '8': [
        [6,7], // row2
        [2,5], // column2
        [0,4] // diagonal
    ]
};

export { globals };
