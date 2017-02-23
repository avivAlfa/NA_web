package Exceptions;

public class InvalidNumberOfPlayersException extends Exception {

    public String getMessage() {
        return "Number of players is invalid";
    }
}
