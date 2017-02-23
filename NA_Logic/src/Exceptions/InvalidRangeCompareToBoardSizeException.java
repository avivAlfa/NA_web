package Exceptions;

public class InvalidRangeCompareToBoardSizeException extends Exception {
    public String getMessage() {
        return "The given range has too many values to the given board size";
    }
}
