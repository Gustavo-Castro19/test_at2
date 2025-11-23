const {TicTacToeGame, TicTacToeMatch, checkWinner, createEmptyBoard} = require('../ticTacToe.js');

describe("-- testes sobre condições de vitória --", () => {
  let testBoardBy3;
  let testBoardBy4;

  beforeEach(() => {
    testBoardBy3 = createEmptyBoard(3);
    testBoardBy4 = createEmptyBoard(4);
  });

  describe("checkWinner deve verificar condição de vitória - em linha, coluna ou diagonal, ao menos em tabuleiros 3x3 e 4x4", 
    () => {

      test("Uma linha cheia de símbolos iguais resulta em vitória", () => {

        const fill_lines = (board,line) => {
          const res = [];
          for(let i = 0; i < board[line].length; ++i){
            board[line][i]='X'
            res.push([line,i])
          } 
          return res 
        }

        for(let i =0; i<testBoardBy3[0].length;++i){
          let line = fill_lines(testBoardBy3,i)
          expect(checkWinner(testBoardBy3))
            .toEqual({'winner': 'X', 'line': line });
          testBoardBy3 = createEmptyBoard(3);
        }

        for(let i = 0; i<testBoardBy4[0].length;i++){
          let line = fill_lines(testBoardBy4,i)
          expect(checkWinner(testBoardBy4))
            .toEqual({'winner': 'X', 'line': line});
          testBoardBy4 = createEmptyBoard(4); 
        }

      });

      test("Uma coluna cheia de símbolos iguais resulta em vitória", () => {

        const fill_columns = (board, column)=>{
          const res = []
          for(let i = 0; i<board[column].length;++i){
            board[i][column] = 'O'; 
            res.push([i,column ])
          }
          return res; 
        }

        for(let i=0; i<testBoardBy3[0].length; ++i){
          let column = fill_columns(testBoardBy3, i); 
          expect(checkWinner(testBoardBy3))
            .toEqual({'winner': 'O', 'line': column });
          testBoardBy3 = createEmptyBoard(3); 
        }

        for(let i=0; i<testBoardBy4[0].length; ++i){
          column = fill_columns(testBoardBy4, i); 
          expect(checkWinner(testBoardBy4))
            .toEqual({'winner': 'O', 'line': column });
          testBoardBy4 = createEmptyBoard(4); 
        }

      });

      test("A diagonal principal cheia de símbolos iguais resulta em vitória", () => {
        testBoardBy3[0][0] = 'X';
        testBoardBy3[1][1] = 'X';
        testBoardBy3[2][2] = 'X';
        expect(checkWinner(testBoardBy3))
          .toEqual({'winner': 'X', 'line': [[0,0],[1,1],[2,2]]});

        testBoardBy4[0][0] = 'X';
        testBoardBy4[1][1] = 'X';
        testBoardBy4[2][2] = 'X';
        testBoardBy4[3][3] = 'X';
        expect(checkWinner(testBoardBy4))
          .toEqual({'winner': 'X', 'line': [[0,0],[1,1],[2,2],[3,3]]});
      });

      test("A diagonal secundária cheia de símbolos iguais resulta em vitória", () => {
        testBoardBy3[0][2] = 'O';
        testBoardBy3[1][1] = 'O';
        testBoardBy3[2][0] = 'O';
        expect(checkWinner(testBoardBy3))
          .toEqual({'winner': 'O', 'line': [[0,2],[1,1],[2,0]]});

        testBoardBy4[0][3] = 'O';
        testBoardBy4[1][2] = 'O';
        testBoardBy4[2][1] = 'O';
        testBoardBy4[3][0] = 'O';
        expect(checkWinner(testBoardBy4))
          .toEqual({'winner': 'O', 'line': [[0,3],[1,2],[2,1],[3,0]]});
      });

      test("caso nenhuma linha ou coluna tenha 3 simbolos iguais, situação de empate", 
        ()=>{

          testBoardBy3[0] = ['X', 'O', 'X'];
          testBoardBy3[1] = ['X', 'O', 'X'];
          testBoardBy3[2] = ['O', 'X', 'O'];
          expect(checkWinner(testBoardBy3))
            .toEqual({winner: null, line: null})    

          testBoardBy4[0] = ['X', 'O', 'X','O'];
          testBoardBy4[1] = ['X', 'O', 'X','O'];
          testBoardBy4[2] = ['O', 'X', 'O','X'];
          testBoardBy4[3] = ['0','X','X','O']
          expect(checkWinner(testBoardBy4))
            .toEqual({winner: null, line: null})    
        })
    });

});

describe("-- TicTacToeGame - comportamento básico --", () => {

  let testGame;

  beforeEach(() => {
    testGame = new TicTacToeGame(3);
  });

  test("sequência de jogadas leva à vitória do jogador X", () => {

    const moves = [
      [0,0], [1,0], 
      [0,1], [1,1], 
      [0,2]
    ]
    for (const [row,collum] of moves) {
      testGame.makeMove(row,collum);
    }

    expect(testGame.getWinner()).toBe("X");
  });

  test("sequência de jogadas resulta em empate", () => {

    const moves = [
      [0,0],[0,1],
      [0,2],[1,1],
      [1,0],[1,2],
      [2,1],[2,0],
      [2,2],
    ];
    for (const [row,collum] of moves) {
      testGame.makeMove(row,collum);
    }

    expect(testGame.isDraw).toBe(true);
    expect(testGame.getWinner()).toBeNull();
  });

  test("impede jogada em célula já ocupada retornando CELL_TAKEN", () => {

    const firstMove = testGame.makeMove(0,0);
    const secondMove = testGame.makeMove(0,0);

    expect(secondMove).toEqual({ok: false, reason: "CELL_TAKEN"});
  });

  test("impede jogada fora do tabuleiro retornando OUT_OF_BOUNDS", () => {

    const firstMove = testGame.makeMove(-1, 0);
    expect(firstMove).toEqual({ok: false, reason: "OUT_OF_BOUNDS"});

    const secondMove = testGame.makeMove(0, -1);
    expect(secondMove).toEqual({ok: false, reason: "OUT_OF_BOUNDS"});

    const thirdMove = testGame.makeMove(3, 3);
    expect(thirdMove).toEqual({ok: false, reason: "OUT_OF_BOUNDS"});
  });

  test("impede jogadas após término do jogo retornando GAME_OVER", () => {
    const moves = [
      [0,0],[1,0],
      [0,1], [1,1],
      [0,2]
    ];

    for (const [row,collum] of moves) {
      testGame.makeMove(row,collum);
    }

    const afterGame = testGame.makeMove(2,2);
    expect(afterGame).toEqual({ok: false, reason: "GAME_OVER"});
  });

  test("verifica alternância correta de currentPlayer entre X e O", () => {
    const moves = [[0,0],[1,1],[0,1]];
    const alt = ['X', 'O'];
    let player = 0;
    getNextPlayer = (player)=> player === 0 ? 1 : 0;  

    for(const [row,column] of moves){
      expect(testGame.getCurrentPlayer()).toBe(alt[player]);
      testGame.makeMove(row,column);
      player =  getNextPlayer(player);
    }

  });

  test("getAvailableMoves() diminui conforme as jogadas são feitas", 
    () => {
      const moves = [[0,0],[0,1],[0,2]]; 
      let total = testGame.getAvailableMoves().length;

      for (const [row,collum] of moves) {
        expect(testGame.getAvailableMoves().length).toBe(total);
        testGame.makeMove(row,collum);
        --total; 
      }

    });

});

describe("-- testes da classe TicTacToeMatch --", () => {
  let testMatch;

  beforeEach(() => {
    testMatch = new TicTacToeMatch(3);
  });

  test("Deve ser possível jogar várias partidas e o placar deve ser atualizado corretamente", () => {
    const firstRound= [[0,0],[1,0],[0,1],[1,1],[0,2]]; 
    for(const [row,column] of firstRound){
      testMatch.playMove(row,column)
    }

    let score = testMatch.getScore();
    expect(score.X).toBe(1);
    expect(score.O).toBe(0);
    expect(score.draws).toBe(0);
    expect(score.roundsPlayed).toBe(1);

    testMatch.startNewRound();

    const secondRound = [[0,0],[0,2],[0,1],[1,1],[2,1],[2,0]] 
    for(const [row,column] of secondRound){
      testMatch.playMove(row,column)
    }

    score = testMatch.getScore();
    expect(score.X).toBe(1);
    expect(score.O).toBe(1);
    expect(score.draws).toBe(0);
    expect(score.roundsPlayed).toBe(2);

    testMatch.startNewRound();
    thirdRound = [[0,0],[0,1],[0,2],[1,0],[1,1],[2,2],[1,2],[2,0],[2,1]] 
    for(const [row,column] of thirdRound){
      testMatch.playMove(row,column);
    }

    score = testMatch.getScore();
    expect(score.X).toBe(1);
    expect(score.O).toBe(1);
    expect(score.draws).toBe(1);
    expect(score.roundsPlayed).toBe(3);
  });

  test("Deve ser possível iniciar um novo round com startNewRound(), mantendo o score acumulado", () => {
    const round = [[0,0],[1,0],[0,1],[1,1],[0,2]] 
    for([row, column] of round){
      testMatch.playMove(row,column)
    }

    let score = testMatch.getScore();
    expect(score.X).toBe(1);
    expect(score.roundsPlayed).toBe(1);

    testMatch.startNewRound();

    score = testMatch.getScore();
    expect(score.X).toBe(1);
    expect(score.O).toBe(0);
    expect(score.draws).toBe(0);
    expect(score.roundsPlayed).toBe(1);

    const board = testMatch.game.getBoard();
    expect(board.every(row => row.every(cell => cell === null))).toBe(true);
    expect(testMatch.game.getCurrentPlayer()).toBe("X");
    expect(testMatch.game.isGameOver()).toBe(false);
  });

  test("Placar deve contabilizar múltiplas vitórias de X corretamente", () => {
    const victory = [[0,0],[1,0],[0,1],[1,1],[0,2]]; 
    for(let i=0; i<10; i++){
      for(const [row, column] of victory){
        testMatch.playMove(row,column); 
      }
      testMatch.startNewRound();
    }

    let score = testMatch.getScore();
    expect(score.X).toBe(10);
    expect(score.O).toBe(0);
    expect(score.draws).toBe(0);
    expect(score.roundsPlayed).toBe(10);
  });

  test("Placar deve contabilizar múltiplas vitórias de O corretamente", () => {
    const victory = [[0,0],[1,0],[0,1],[1,1],[2,2],[1,2]]
    for(let i=0; i<10; ++i){
      for(const [row,column] of victory){
        testMatch.playMove(row,column); 
      }
      testMatch.startNewRound();
    }

    let score = testMatch.getScore();
    expect(score.X).toBe(0);
    expect(score.O).toBe(10);
    expect(score.draws).toBe(0);
    expect(score.roundsPlayed).toBe(10);
  });

  test("Placar deve contabilizar múltiplos empates corretamente", () => {
    const draw = [[0, 0],[0,1],[0,2],
      [1,0],[1,1],[2,2],
      [1,2],[2,0],[2,1]];

    for(let i=0;i<10;++i ){
      for(const[row,column] of draw){
        testMatch.playMove(row,column);
      }
      testMatch.startNewRound();
    }

    let score = testMatch.getScore();
    expect(score.X).toBe(0);
    expect(score.O).toBe(0);
    expect(score.draws).toBe(10);
    expect(score.roundsPlayed).toBe(10);

  });

  test("Placar deve contabilizar combinação de vitórias de X, O e empates", () => {

    const xVictory = [[0,0],[1,0],[0,1],[1,1],[0,2]]; 
    for(let i=0; i<10; i++){
      for(const [row, column] of xVictory){
        testMatch.playMove(row,column); 
      }
      testMatch.startNewRound();
    }

    const oVictory = [[0,0],[1,0],[0,1],[1,1],[2,2],[1,2]]
    for(let i=0; i<10; ++i){
      for(const [row,column] of oVictory){
        testMatch.playMove(row,column); 
      }
      testMatch.startNewRound();
    }

    const draw = [[0, 0],[0,1],[0,2],
      [1,0],[1,1],[2,2],
      [1,2],[2,0],[2,1]];
    for(let i=0;i<10;++i ){
      for(const[row,column] of draw){
        testMatch.playMove(row,column);
      }
      testMatch.startNewRound();
    }

    let score = testMatch.getScore();
    expect(score.X).toBe(10);
    expect(score.O).toBe(10);
    expect(score.draws).toBe(10);
    expect(score.roundsPlayed).toBe(30);
  });

  test("getState() deve retornar o estado completo do match", () => {
    testMatch.playMove(0, 0);
    testMatch.playMove(1, 0); 

    const state = testMatch.getState();

    expect(state).toHaveProperty('score');
    expect(state).toHaveProperty('game');
    expect(state.score.X).toBe(0);
    expect(state.score.O).toBe(0);
    expect(state.score.draws).toBe(0);
    expect(state.score.roundsPlayed).toBe(0);
    expect(state.game.currentPlayer).toBe('X');
  });
});
