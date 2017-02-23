package Exceptions;

/**
 * Created by alfav on 12/14/2016.
 */
public class CursorOutOfBoundsException extends Exception {
    private int row;
    private int col;
    private int bound;

    public CursorOutOfBoundsException(int _row, int _col, int _bound){
        row = _row;
        col = _col;
        bound = _bound;
    }

    public String getMessage() {
        String msg = null;
        if(row > bound && col > bound){
            msg = "The marker is out of bounds";
        }
        else if(row > bound){
            msg = "The marker row is out of bounds";
        }
        else if(col > bound){
            msg = "The marker column is out of bounds";
        }
        return msg + "\nmarker content: row(" + row + "), col(" + col + ").";
    }
}
