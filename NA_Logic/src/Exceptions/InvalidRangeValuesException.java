package Exceptions;

/**
 * Created by alfav on 12/17/2016.
 */
public class InvalidRangeValuesException extends Exception{

    public String getMessage() {
        return "The given range is Invalid, range values should be between -99 to 99";
    }
}
