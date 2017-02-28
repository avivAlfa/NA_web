package webEngine.gamesManager;


import game.AdvancedGameEngine;
import game.BasicGameEngine;
import game.GameEngine;
import game.Player;
import generated.GameDescriptor;

import javax.xml.bind.JAXBException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class GameObject {
    private GameEngine gameEngine;
    private int key;
    private String title;
    private String creatorName;
    private int requiredNumOfPlayers;
    private GameStatus gameStatus;

    public GameEngine getGameEngine() {
        return gameEngine;
    }

    public int getKey() {
        return key;
    }
    public void setKey(int key) {
        this.key = key;
    }

    public GameStatus getGameStatus() {
        return gameStatus;
    }
    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public String getTitle() {
        return title;
    }

    public int getRequiredNumOfPlayers() {
        return requiredNumOfPlayers;
    }

    public String initGame(String xmlDescription, String creatorName, int key) throws Exception {
        this.key = key;
        this.creatorName = creatorName;

        loadGame(xmlDescription);
        gameStatus = GameStatus.WaitingForPlayers;
       // this.players = new ArrayList();
       // this.status = GameStatus.WaitingForPlayers;
       // this.initControllerData();
        return this.title;

    }

    public void loadGame(String inputStream) throws Exception {
        GameDescriptor gameDescriptor = null;

        gameDescriptor = game.XML_Handler.getGameDescriptorFromXml(inputStream);
        game.XML_Handler.validate(gameDescriptor);
        if (gameDescriptor != null) {
            if(gameDescriptor.getGameType().equals("AdvanceDynamic")){
                this.title = gameDescriptor.getDynamicPlayers().getGameTitle();
                this.requiredNumOfPlayers = gameDescriptor.getDynamicPlayers().getTotalPlayers();
            }else{
                this.title = "Basic Game";
                this.requiredNumOfPlayers = 2;
            }
            loadGameEngine(gameDescriptor); //loading basic/advance gameEngine
        }
    }

    private void loadGameEngine(GameDescriptor gameDescriptor) {
        switch (gameDescriptor.getGameType()) {
            case "Basic":
                gameEngine = new BasicGameEngine(); //new BasicEngine
                break;
            case "AdvanceDynamic":
                gameEngine = new AdvancedGameEngine();
                break;
            default:
                gameEngine = null;
        }
        gameEngine.loadGameParams();
        gameEngine.loadGameParamsFromDescriptor(gameDescriptor);
    }

    public boolean containsUserName(String userName){
        List<Player> players = gameEngine.getPlayers();
        for (Player p : players) {
            if(p.getName().equals(userName))
                return true;
        }
        return false;
    }
}
