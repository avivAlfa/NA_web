package Exceptions;

/**
 * Created by NofarD on 1/12/2017.
 */
public class InvalidNumberOfColorsException extends Exception {

    public String getMessage() {
        return "Not all players have a unique color!";
    }
}
