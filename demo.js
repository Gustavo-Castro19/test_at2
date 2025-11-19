// jogar_terminal.js
const readline = require("readline");
const { TicTacToeGame } = require("./ticTacToe");

// Configuração: humano é X, computador é O
const HUMAN = "X";
const COMPUTER = "O";

// Interface de leitura do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Imprime o tabuleiro bonitinho no terminal.
 */
function printBoard(game) {
  const board = game.getBoard();
  console.log("\n   0 1 2");
  board.forEach((row, r) => {
    const line = row.map((cell) => (cell === null ? "." : cell)).join(" ");
    console.log(`${r}  ${line}`);
  });
}

/**
 * Mostra o resultado final e encerra o programa.
 */
function announceResult(game) {
  printBoard(game);

  const winner = game.getWinner();
  if (winner) {
    console.log(`\nFim de jogo! Jogador ${winner} venceu.`);
  } else {
    console.log("\nFim de jogo! Deu empate.");
  }

  rl.close();
}

/**
 * Jogada do computador: escolhe um movimento disponível aleatório.
 */
function computerMove(game) {
  const moves = game.getAvailableMoves();
  if (moves.length === 0) {
    announceResult(game);
    return;
  }

  const move = moves[Math.floor(Math.random() * moves.length)];
  const result = game.makeMove(move.row, move.col);

  console.log(`\nComputador (${COMPUTER}) jogou em (${move.row}, ${move.col})`);

  if (result.isGameOver) {
    announceResult(game);
  } else {
    nextTurn(game);
  }
}

/**
 * Pergunta a jogada do humano pelo terminal.
 */
function askHumanMove(game) {
  printBoard(game);
  rl.question(
    `\nSua vez (${HUMAN}). Digite "linha coluna" (ex: 0 2) ou "q" para sair: `,
    (answer) => {
      const trimmed = answer.trim();

      if (trimmed.toLowerCase() === "q") {
        console.log("Saindo do jogo...");
        rl.close();
        return;
      }

      const parts = trimmed.split(/\s+/);
      if (parts.length !== 2) {
        console.log("Entrada inválida. Use o formato: linha coluna (ex: 1 2).");
        askHumanMove(game);
        return;
      }

      const row = Number(parts[0]);
      const col = Number(parts[1]);

      if (!Number.isInteger(row) || !Number.isInteger(col)) {
        console.log("Você precisa digitar números inteiros (ex: 0 1).");
        askHumanMove(game);
        return;
      }

      const result = game.makeMove(row, col);

      if (!result.ok) {
        console.log("Jogada inválida:", result.reason);
        askHumanMove(game);
        return;
      }

      if (result.isGameOver) {
        announceResult(game);
      } else {
        nextTurn(game);
      }
    }
  );
}

/**
 * Decide de quem é a vez e chama a função certa.
 */
function nextTurn(game) {
  if (game.isGameOver()) {
    announceResult(game);
    return;
  }

  const current = game.getCurrentPlayer();
  if (current === HUMAN) {
    askHumanMove(game);
  } else {
    computerMove(game);
  }
}

/**
 * Função principal.
 */
function main() {
  const game = new TicTacToeGame(3); // pode mudar pra 4, 5 etc se quiser
  console.log("Bem-vindo ao Jogo da Velha!");
  console.log(`Você é o jogador ${HUMAN}, o computador é ${COMPUTER}.`);
  console.log("Posições são (linha, coluna) de 0 a 2.\n");
  nextTurn(game);
}

main();
