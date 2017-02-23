package Exceptions;

/**
 * Created by alfav on 12/14/2016.
 */
public class InvalidRangeException extends Exception {

    public String getMessage() {
        return "The given range is Invalid, To value is smaller than From value";
    }
}
