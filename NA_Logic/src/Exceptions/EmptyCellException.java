package Exceptions;

/**
 * Created by alfav on 11/28/2016.
 */
public class EmptyCellException extends Exception {

    public String getMessage() {
        return "You've chosen an empty cell, please try again!";
    }
}
