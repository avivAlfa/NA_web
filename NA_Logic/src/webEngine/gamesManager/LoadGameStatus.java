package webEngine.gamesManager;

/**
 * Created by alfav on 2/23/2017.
 */
public class LoadGameStatus {
    private boolean isLoaded;
    private String errorMessage;

    public LoadGameStatus(boolean isLoaded, String message) {
        this.isLoaded = isLoaded;
        this.errorMessage = message;
    }

    public boolean isLoaded() {
        return this.isLoaded;
    }

    public void setLoaded(boolean loaded) {
        this.isLoaded = loaded;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
