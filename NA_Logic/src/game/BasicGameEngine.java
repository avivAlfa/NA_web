package game;

import generated.GameDescriptor;

import java.awt.*;
import java.util.*;
import java.util.List;


public class BasicGameEngine extends GameEngine {
    @Override
    public List<Point> getPossibleCells() {
        List<Point> possibleCells = new ArrayList<Point>();
        Cell currCell;

        if (playerTurnIndex % 2 == 0) { //rowPlayer{
            for (int j = 0; j < gameBoard.getSize(); j++) {
                currCell = gameBoard.getCell(cursorRow, j);
                if ((!currCell.isEmpty()) && ((!currCell.isCursor()))) {
                    possibleCells.add(new Point(cursorRow, j));
                }
            }

        }
        else {
            for (int i = 0; i < gameBoard.getSize(); i++) {
                currCell = gameBoard.getCell(i, cursorCol);
                if ((!currCell.isEmpty()) && ((!currCell.isCursor()))) {
                    possibleCells.add(new Point(i, cursorCol));
                }
            }
        }
        return possibleCells;
    }

    @Override
    public List<Point> getNextPlayerOpportunities(int selectedRow, int selectedCol) {
        List<Point> nextPlayerOpportunities = new ArrayList<Point>();
        Cell currCell;
        int nextPlayerIndex = getNextPlayerIndex();

        if (nextPlayerIndex % 2 == 0) { //rowPlayer{
            for (int j = 0; j < gameBoard.getSize(); j++) {
                currCell = gameBoard.getCell(selectedRow, j);
                if ((!currCell.isEmpty()) && ((!currCell.isCursor())) && j != selectedCol) {
                    nextPlayerOpportunities.add(new Point(selectedRow, j));
                }
            }
        }
        else {
            for (int i = 0; i < gameBoard.getSize(); i++) {
                currCell = gameBoard.getCell(i, selectedCol);
                if ((!currCell.isEmpty()) && ((!currCell.isCursor())) && i != selectedRow) {
                    nextPlayerOpportunities.add(new Point(i, selectedCol));
                }
            }
        }

        return nextPlayerOpportunities;
    }

    @Override
    public List<Point> getAllPossibleCells() {
        return new ArrayList<Point>() ;
    }

    @Override
    public void setPossibleAsEmpty(List<Point> possibleCells) {

    }

    @Override
    public boolean endGame(){
        boolean gameEnded = true;
        if (playerTurnIndex % 2 == 0) { //even - row player}
            for(int j=0; j < gameBoard.getSize(); j++){
                if(gameBoard.getCell(cursorRow, j).isEmpty() == false && j != cursorCol){
                    gameEnded = false;
                }
            }
        }
        else { //col player
            for (int i = 0; i < gameBoard.getSize(); i++) {
                if (gameBoard.getCell(i, cursorCol).isEmpty() == false && i != cursorRow) {
                    gameEnded = false;
                }
            }
        }

        return gameEnded || players.size() == 1;
    }

    @Override
    protected List<PoolElement> createPool(int boardSize, int rangeFrom, int rangeTo, List<GameDescriptor.Players.Player> players){
        List<PoolElement> pool = new ArrayList<PoolElement>();
        int rangeSize = rangeTo - rangeFrom + 1;
        PoolElement tempElem;
        int numOfImpressions = (int)(Math.pow(boardSize,2) - 1) / rangeSize;

        for(int i = rangeFrom; i <= rangeTo; i++) {
            for (int j = 0; j < numOfImpressions; j++) {
                tempElem = new PoolElement(i,0);
                pool.add(tempElem);
            }
        }

        for(int i = 0; i < ((int)((Math.pow(boardSize,2) - 1) % rangeSize)); i++) { //empty cells
            tempElem = new PoolElement(-999, 0);
            pool.add(tempElem);
           // pool.add(-999);
        }
        tempElem = new PoolElement(999, 0);
        pool.add(tempElem); //cursor

        return pool;
    }

    @Override
    public String getPlayerColor(Player player) {
        return "";
    }

    @Override
    public Point getComputerChosenCellIndexes(){
        Point chosenIndexes = new Point();
        int maxValue = -999;

        if(playerTurnIndex%2 == 0) {//row Player
            for(int i=0; i <gameBoard.getSize(); i++) {
                Cell currentCell = gameBoard.getCell(cursorRow, i);
                if(!currentCell.isCursor() && !currentCell.isEmpty()) {
                    if (currentCell.getValue() > maxValue) {
                        maxValue = currentCell.getValue();
                        chosenIndexes.setLocation(cursorRow,i);
                    }
                }
            }
        }
        else {
            for(int i=0; i < gameBoard.getSize(); i++) {
                Cell currentCell = gameBoard.getCell(i, cursorCol);
                if(!currentCell.isCursor() && !currentCell.isEmpty()) {
                    if (currentCell.getValue() > maxValue) {
                        maxValue = currentCell.getValue();
                        chosenIndexes.setLocation(i,cursorCol);
                    }
                }
            }
        }
        return chosenIndexes;
    }

}
