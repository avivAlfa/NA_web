package Exceptions;

/**
 * Created by alfav on 12/16/2016.
 */
public class InvalidPlayerTypeException extends Exception{

    public String getMessage() {
        return "Invalid player type received in XML file";
    }
}
