package Exceptions;

/**
 * Created by alfav on 12/14/2016.
 */
public class CellOutOfBoundsException extends Exception {
    private int row;
    private int col;
    private int value;
    private int bound;

    public CellOutOfBoundsException(int _row, int _col, int _value, int _bound){
        row = _row;
        col = _col;
        value = _value;
        bound = _bound;
    }

    public String getMessage() {
        String msg = null;
        if(row > bound && col > bound){
            msg = "The xml file contains a square that is out of bounds";
        }
        else if(row > bound){
            msg = "The xml file contains a square with row value out of bounds";
        }
        else if(col > bound){
            msg = "The xml file contains a square with col value out of bounds";
        }
        return msg + "\nSquare content: row(" + row + "), col(" + col + "), value(" + value + ").";
    }
}
