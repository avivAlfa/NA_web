package webEngine.gamesManager;

public class GameStatusMessage {
    GameStatus status;
    String currentPlayerName;

    public GameStatusMessage(GameStatus status, String currentPlayerTurnName) {
        this.status = status;
        this.currentPlayerName = currentPlayerTurnName;
    }

    public GameStatus getStatus() {
        return this.status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public String getCurrentPlayerName() {
        return currentPlayerName;
    }

    public void setCurrentPlayerName(String currentPlayerName) {
        this.currentPlayerName = currentPlayerName;
    }
}
