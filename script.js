document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart');

    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    const humanPlayer = 'O';
    const aiPlayer = 'X';
    let currentPlayer = humanPlayer;

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function checkWin(board, player) {
        return winConditions.some(condition => {
            return condition.every(index => board[index] === player);
        });
    }

    function isBoardFull(board) {
        return board.every(cell => cell !== '');
    }

    function minimax(board, depth, isMaximizing, alpha, beta) {
        if (checkWin(board, aiPlayer)) return 10 - depth;
        if (checkWin(board, humanPlayer)) return depth - 10;
        if (isBoardFull(board)) return 0;

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = aiPlayer;
                    let eval = minimax(board, depth + 1, false, alpha, beta);
                    board[i] = '';
                    maxEval = Math.max(maxEval, eval);
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) break;
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = humanPlayer;
                    let eval = minimax(board, depth + 1, true, alpha, beta);
                    board[i] = '';
                    minEval = Math.min(minEval, eval);
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) break;
                }
            }
            return minEval;
        }
    }

    function bestMove() {
        let bestEval = -Infinity;
        let move = -1;
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = aiPlayer;
                let eval = minimax(gameBoard, 0, false, -Infinity, Infinity);
                gameBoard[i] = '';
                if (eval > bestEval) {
                    bestEval = eval;
                    move = i;
                }
            }
        }
        return move;
    }

    function handleClick(event) {
        const index = event.target.getAttribute('data-index');
        if (gameBoard[index] !== '' || checkWin(gameBoard, humanPlayer) || checkWin(gameBoard, aiPlayer)) {
            return;
        }
        gameBoard[index] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWin(gameBoard, currentPlayer)) {
            setTimeout(() => alert(`${currentPlayer} wins!`), 100);
        } else if (isBoardFull(gameBoard)) {
            setTimeout(() => alert('Draw!'), 100);
        } else {
            currentPlayer = aiPlayer;
            const aiMove = bestMove();
            gameBoard[aiMove] = aiPlayer;
            cells[aiMove].textContent = aiPlayer;
            if (checkWin(gameBoard, aiPlayer)) {
                setTimeout(() => alert(`${aiPlayer} wins!`), 100);
            } else if (isBoardFull(gameBoard)) {
                setTimeout(() => alert('Draw!'), 100);
            }
            currentPlayer = humanPlayer;
        }
    }

    function restartGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => (cell.textContent = ''));
        currentPlayer = humanPlayer;
    }

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    restartButton.addEventListener('click', restartGame);
});
