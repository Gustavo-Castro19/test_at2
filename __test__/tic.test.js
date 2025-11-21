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
