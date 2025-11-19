const ticTac = require('../ticTacToe.js');

describe("Check Winner deve verificar Condição de vitória - em linha, coluna ou diagonal, ao menos em tabuleiros 3x3-4x4", () => {
  test("Uma linha cheia de simbolos iguais resultam em vitória", ()=>{
    const testBoardBy3= ticTac.createEmptyBoard(3);
    testBoardBy3[0][0] = 'X'
    testBoardBy3[0][1] = 'X'
    testBoardBy3[0][2] = 'X'
    expect(ticTac.checkWinner(testBoardBy3))
      .toEqual({'winner': 'X', 'line': [[0,0],[0,1],[0,2]]})

    const testBoardBy4 = ticTac.createEmptyBoard(4);
    testBoardBy4[0][0] = 'X'
    testBoardBy4[0][1] = 'X'
    testBoardBy4[0][2] = 'X'
    testBoardBy4[0][3] = 'X'
    expect(ticTac.checkWinner(testBoardBy4))
      .toEqual({'winner': 'X', 'line': [[0,0],[0,1],[0,2],[0,3]]})
  });
  test("Uma coluna cheia de simbolos iguais resulta em vitória",()=>{
    const testBoardBy3= ticTac.createEmptyBoard(3);
    testBoardBy3[0][0] = 'O'
    testBoardBy3[1][0] = 'O'
    testBoardBy3[2][0] = 'O'
    expect(ticTac.checkWinner(testBoardBy3))
      .toEqual({'winner': 'O', 'line': [[0,0],[1,0],[2,0]]})

    const testBoardBy4= ticTac.createEmptyBoard(4);
    testBoardBy4[0][0] = 'O'
    testBoardBy4[1][0] = 'O'
    testBoardBy4[2][0] = 'O'
    testBoardBy4[3][0] = 'O'
    expect(ticTac.checkWinner(testBoardBy4))
      .toEqual({'winner': 'O', 'line': [[0,0],[1,0],[2,0],[3,0]]})
  });

  test("A diagonal principal cheia de simbolos iguais resulta em vitória", ()=>{
    const testBoardBy3= ticTac.createEmptyBoard(3);
    testBoardBy3[0][0] = 'X'
    testBoardBy3[1][1] = 'X'
    testBoardBy3[2][2] = 'X'
    expect(ticTac.checkWinner(testBoardBy3))
      .toEqual({'winner': 'X', 'line': [[0,0],[1,1],[2,2]]})

    const testBoardBy4= ticTac.createEmptyBoard(4);
    testBoardBy4[0][0] = 'X'
    testBoardBy4[1][1] = 'X'
    testBoardBy4[2][2] = 'X'
    testBoardBy4[3][3] = 'X'
    expect(ticTac.checkWinner(testBoardBy4))
      .toEqual({'winner': 'X', 'line': [[0,0],[1,1],[2,2],[3,3]]})
  });

  test("A diagonal secundária cheia de simbolos iguais resulta em vitória", ()=>{
    const testBoardBy3= ticTac.createEmptyBoard(3);
    testBoardBy3[0][2] = 'O'
    testBoardBy3[1][1] = 'O'
    testBoardBy3[2][0] = 'O'
    expect(ticTac.checkWinner(testBoardBy3))
      .toEqual({'winner': 'O', 'line': [[0,2],[1,1],[2,0]]})

    const testBoardBy4= ticTac.createEmptyBoard(4);
    testBoardBy4[0][3] = 'O'
    testBoardBy4[1][2] = 'O'
    testBoardBy4[2][1] = 'O'
    testBoardBy4[3][0] = 'O'
    expect(ticTac.checkWinner(testBoardBy4))
      .toEqual({'winner': 'O', 'line': [[0,3],[1,2],[2,1],[3,0]]})
  });
});

