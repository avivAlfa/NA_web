package Exceptions;
/**
 * Created by alfav on 12/13/2016.
 */
public class duplicateGameNameException extends Exception {

    public String getMessage() {
        return "There is already a game with that title";
    }

}