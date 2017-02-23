package Exceptions;

/**
 * Created by alfav on 12/13/2016.
 */
public class CursorCellException extends Exception {

    public String getMessage() {
        return "You've chosen the cursor's cell, please try again!";
    }

}
