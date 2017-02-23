package game;

import java.awt.*;
import java.util.List;

public class GamePosition {

    Player currPlayer;
    List<Player> allPlayers;
    Point selectedPoint;
    Cell selectedCell;
    int totalMoves;

    List<Cell> resinedCells;
    List<Point> resinedPoints;

    public GamePosition(Player currPlayer, List<Player> allPlayers, Point selectedPoint, Cell selectedCell, int totalMoves) {
        this.currPlayer = currPlayer;
        this.allPlayers = allPlayers;
        this.selectedPoint = selectedPoint;
        this.selectedCell = selectedCell;
        this.totalMoves = totalMoves;
    }

    public GamePosition(Player currPlayer,List<Player> allPlayers, List<Cell> cells, List<Point> points, Point prevSelectedPoint, Cell prevSelectedCell, int totalMoves) {
        this.currPlayer = currPlayer;
        this.allPlayers = allPlayers;
        this.resinedCells = cells;
        this.resinedPoints = points;
        this.selectedPoint = prevSelectedPoint;
        this.selectedCell = prevSelectedCell;
        this.totalMoves = totalMoves;
    }

    public Player getCurrPlayer() {
        return currPlayer;
    }

    public void setCurrPlayer(Player currPlayer) {
        this.currPlayer = currPlayer;
    }

    public List<Player> getAllPlayers() {
        return allPlayers;
    }

    public void setAllPlayers(List<Player> allPlayers) {
        this.allPlayers = allPlayers;
    }

    public Cell getSelectedCell() {
        return selectedCell;
    }

    public void setSelectedCell(Cell selectedCell) {
        this.selectedCell = selectedCell;
    }

    public Point getSelectedPoint() {
        return selectedPoint;
    }

    public void setSelectedPoint(Point selectedPoint) {
        this.selectedPoint = selectedPoint;
    }

    public int getTotalMoves() {
        return totalMoves;
    }

    public void setTotalMoves(int totalMoves) {
        this.totalMoves = totalMoves;
    }

    public List<Point> getResinedPoints() {
        return resinedPoints;
    }

    public List<Cell> getResinedCells() {
        return resinedCells;
    }

}
