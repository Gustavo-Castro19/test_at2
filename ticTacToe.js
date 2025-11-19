// ticTacToe.js

/**
 * Representa um tabuleiro de Jogo da Velha (tic-tac-toe) genérico.
 * Por padrão é 3x3, mas pode receber outro tamanho >= 3.
 *
 * Cada célula do board é:
 *   - null  -> vazio
 *   - "X"   -> jogador X
 *   - "O"   -> jogador O
 *
 * Uso típico:
 *   const game = new TicTacToeGame();
 *   game.makeMove(0, 0); // X
 *   game.makeMove(1, 1); // O
 *   ...
 */

class TicTacToeGame {
  /**
   * @param {number} size - tamanho do tabuleiro (default 3)
   */
  constructor(size = 3) {
    if (!Number.isInteger(size) || size < 3) {
      throw new Error("Board size must be an integer >= 3");
    }

    this.size = size;
    this.board = createEmptyBoard(size);
    this.currentPlayer = "X"; // X sempre começa
    this.winner = null;       // "X", "O" ou null
    this.isDraw = false;
    this.movesCount = 0;
    this.winningLine = null;  // array de posições [ [row, col], ... ]
  }

  /**
   * Retorna uma cópia do board para evitar mutação externa.
   */
  getBoard() {
    return this.board.map((row) => row.slice());
  }

  /**
   * Retorna qual jogador deve jogar agora: "X" ou "O".
   */
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  /**
   * Retorna se o jogo já acabou (vitória ou empate).
   */
  isGameOver() {
    return this.winner !== null || this.isDraw === true;
  }

  /**
   * Retorna o vencedor ("X" ou "O"), ou null se ainda não houver.
   */
  getWinner() {
    return this.winner;
  }

  /**
   * Retorna a linha vencedora (array de [row, col]) ou null.
   */
  getWinningLine() {
    return this.winningLine ? this.winningLine.map(([r, c]) => ({ row: r, col: c })) : null;
  }

  /**
   * Retorna uma lista de movimentos possíveis ainda não jogados.
   * Ex: [ { row:0, col:1 }, { row:2, col:2 }, ... ]
   */
  getAvailableMoves() {
    const moves = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === null) {
          moves.push({ row: r, col: c });
        }
      }
    }
    return moves;
  }

  /**
   * Faz uma jogada para o jogador atual na posição (row, col).
   *
   * Retorna um objeto com:
   *  - ok: boolean
   *  - reason: string (se ok === false)
   *  - player: "X"|"O" (jogador que jogou)
   *  - row, col
   *  - winner: "X"|"O"|null
   *  - isDraw: boolean
   *  - isGameOver: boolean
   *  - winningLine: array de {row, col} ou null
   */
  makeMove(row, col) {
    // Verifica se o jogo já acabou
    if (this.isGameOver()) {
      return {
        ok: false,
        reason: "GAME_OVER",
      };
    }

    // Verifica coordenadas válidas
    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      return {
        ok: false,
        reason: "INVALID_COORDINATES",
      };
    }

    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return {
        ok: false,
        reason: "OUT_OF_BOUNDS",
      };
    }

    // Verifica se a célula já está ocupada
    if (this.board[row][col] !== null) {
      return {
        ok: false,
        reason: "CELL_TAKEN",
      };
    }

    // Registra jogada
    const player = this.currentPlayer;
    this.board[row][col] = player;
    this.movesCount += 1;

    // Atualiza estado do jogo (vitória/empate)
    this._updateGameState();

    // Alterna jogador se o jogo ainda não acabou
    if (!this.isGameOver()) {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }

    return {
      ok: true,
      player,
      row,
      col,
      winner: this.winner,
      isDraw: this.isDraw,
      isGameOver: this.isGameOver(),
      winningLine: this.getWinningLine(),
    };
  }

  /**
   * Atualiza winner, isDraw e winningLine com base no board atual.
   * Usa a função pura checkWinner para facilitar testes unitários.
   *
   * @private
   */
  _updateGameState() {
    const { winner, line } = checkWinner(this.board);
    if (winner) {
      this.winner = winner;
      this.winningLine = line;
      return;
    }

    const totalCells = this.size * this.size;
    if (this.movesCount >= totalCells) {
      this.isDraw = true;
    }
  }

  /**
   * Reseta o jogo para um novo round, mantendo o mesmo tamanho de tabuleiro.
   */
  reset() {
    this.board = createEmptyBoard(this.size);
    this.currentPlayer = "X";
    this.winner = null;
    this.isDraw = false;
    this.movesCount = 0;
    this.winningLine = null;
  }

  /**
   * Serializa o estado do jogo em um objeto simples,
   * útil para salvar / carregar ou testar estados específicos.
   */
  serialize() {
    return {
      size: this.size,
      board: this.getBoard(),
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      isDraw: this.isDraw,
      movesCount: this.movesCount,
      winningLine: this.winningLine
        ? this.winningLine.map(([r, c]) => ({ row: r, col: c }))
        : null,
    };
  }

  /**
   * Cria uma instância de TicTacToeGame a partir de um estado serializado.
   * Ideal para cenários de teste com tabuleiros pré-configurados.
   */
  static fromSerialized(state) {
    const game = new TicTacToeGame(state.size || 3);
    if (!Array.isArray(state.board)) {
      throw new Error("Invalid serialized state: board must be an array");
    }

    if (state.board.length !== game.size) {
      throw new Error("Serialized board size does not match 'size'");
    }

    game.board = state.board.map((row) => row.slice());
    game.currentPlayer = state.currentPlayer || "X";
    game.winner = state.winner || null;
    game.isDraw = !!state.isDraw;
    game.movesCount = typeof state.movesCount === "number" ? state.movesCount : 0;

    if (Array.isArray(state.winningLine)) {
      game.winningLine = state.winningLine.map((pos) => [pos.row, pos.col]);
    } else {
      game.winningLine = null;
    }

    return game;
  }
}

/**
 * Função pura que verifica se há um vencedor em um board.
 * Não altera o board. Bom alvo para testes unitários isolados.
 *
 * @param {Array<Array<"X"|"O"|null>>} board
 * @returns {{winner: "X"|"O"|null, line: Array<[number, number]> | null}}
 */
function checkWinner(board) {
  const size = board.length;

  // Verifica linhas
  for (let r = 0; r < size; r++) {
    const first = board[r][0];
    if (!first) continue;
    let allEqual = true;
    for (let c = 1; c < size; c++) {
      if (board[r][c] !== first) {
        allEqual = false;
        break;
      }
    }
    if (allEqual) {
      const line = [];
      for (let c = 0; c < size; c++) {
        line.push([r, c]);
      }
      return { winner: first, line };
    }
  }

  // Verifica colunas
  for (let c = 0; c < size; c++) {
    const first = board[0][c];
    if (!first) continue;
    let allEqual = true;
    for (let r = 1; r < size; r++) {
      if (board[r][c] !== first) {
        allEqual = false;
        break;
      }
    }
    if (allEqual) {
      const line = [];
      for (let r = 0; r < size; r++) {
        line.push([r, c]);
      }
      return { winner: first, line };
    }
  }

  // Verifica diagonal principal
  {
    const first = board[0][0];
    if (first) {
      let allEqual = true;
      for (let i = 1; i < size; i++) {
        if (board[i][i] !== first) {
          allEqual = false;
          break;
        }
      }
      if (allEqual) {
        const line = [];
        for (let i = 0; i < size; i++) {
          line.push([i, i]);
        }
        return { winner: first, line };
      }
    }
  }

  // Verifica diagonal secundária
  {
    const first = board[0][size - 1];
    if (first) {
      let allEqual = true;
      for (let i = 1; i < size; i++) {
        if (board[i][size - 1 - i] !== first) {
          allEqual = false;
          break;
        }
      }
      if (allEqual) {
        const line = [];
        for (let i = 0; i < size; i++) {
          line.push([i, size - 1 - i]);
        }
        return { winner: first, line };
      }
    }
  }

  // Sem vencedor
  return { winner: null, line: null };
}

/**
 * Cria um board vazio size x size preenchido com null.
 *
 * @param {number} size
 */
function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

/**
 * Gerencia várias rodadas de jogo e o placar.
 * Serve como cenário extra para testes de "integração".
 */
class TicTacToeMatch {
  constructor(size = 3) {
    this.game = new TicTacToeGame(size);
    this.score = {
      X: 0,
      O: 0,
      draws: 0,
      roundsPlayed: 0,
    };
  }

  /**
   * Faz uma jogada no jogo atual.
   * Se a jogada encerrar o jogo, atualiza o placar automaticamente.
   */
  playMove(row, col) {
    const result = this.game.makeMove(row, col);

    if (result.ok && result.isGameOver) {
      const winner = result.winner;
      if (winner === "X") {
        this.score.X += 1;
      } else if (winner === "O") {
        this.score.O += 1;
      } else if (result.isDraw) {
        this.score.draws += 1;
      }
      this.score.roundsPlayed += 1;
    }

    return result;
  }

  /**
   * Inicia um novo round, mas mantém o placar acumulado.
   */
  startNewRound() {
    this.game.reset();
  }

  /**
   * Retorna uma cópia do placar.
   */
  getScore() {
    return { ...this.score };
  }

  /**
   * Retorna o estado atual completo (útil para testes).
   */
  getState() {
    return {
      score: this.getScore(),
      game: this.game.serialize(),
    };
  }
}

module.exports = {
  TicTacToeGame,
  TicTacToeMatch,
  checkWinner,
  createEmptyBoard,
};
