package game;

import generated.GameDescriptor;

public class Board {
    private Cell[][] board;
    private int size;

    public Board(){}

    public Board(Cell[][] board, int size) {
        this.board = board;
        this.size = size;
    }

    public Cell[][] getBoard() {
        return board;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getCellValue(int row, int col){
        return board[row][col].getValue();
    }

    public Cell getCell(int row, int col){
        return board[row][col];
    }

    public boolean isInBorders(int row, int col)
    {
        return (row >=0 && row < this.size)&&(col >= 0 && col < this.size);
    }

    public boolean isIndexInBorders(int index){
        return index >= 0 && index < this.size;
    }

    public boolean isEmptyCell(int row, int col)
    {
        return board[row][col].isEmpty();
    }
}
