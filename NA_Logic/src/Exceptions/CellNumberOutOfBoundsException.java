package Exceptions;

/**
 * Created by alfav on 11/28/2016.
 */
public class CellNumberOutOfBoundsException extends Exception {
    public String getMessage() {
        return "You've chosen an out of range index, please try again!";
    }
}
