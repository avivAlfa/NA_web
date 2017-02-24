package webEngine.gamesManager;


public enum GameStatus {
    Building,
    Error,
    WaitingForPlayers,
    Running,
    Finished;

    private GameStatus() {
    }
}