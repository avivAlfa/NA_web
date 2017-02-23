package Exceptions;

/**
 * Created by alfav on 12/14/2016.
 */
public class InvalidBoardSizeException extends Exception {

    public String getMessage() {
        return "The given board size is Invalid, size should be between 5 to 50";
    }
}
