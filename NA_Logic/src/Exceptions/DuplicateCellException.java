package Exceptions;

public class DuplicateCellException extends Exception {
    private int row;
    private int col;
    private int value;

    public DuplicateCellException(int _row, int _col, int _value){
        row = _row;
        col = _col;
        value = _value;
    }

    public String getMessage() {
        String msg = null;
        msg = "The xml file contains a duplicated square.";
        return msg + "\nSquare content: row(" + row + "), col(" + col + "), value(" + value + ").";
    }
}
