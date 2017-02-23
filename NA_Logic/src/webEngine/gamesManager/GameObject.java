package webEngine.gamesManager;


import game.AdvancedGameEngine;
import game.BasicGameEngine;
import game.GameEngine;
import generated.GameDescriptor;

import javax.xml.bind.JAXBException;
import java.io.IOException;
import java.io.InputStream;

public class GameObject {
    private GameEngine gameEngine;
    private int key;
    private String title;
    private String creatorName;
    private int requiredNumOfPlayers;
    private int registredNumOfPlayers;

    public int getKey() {
        return key;
    }
    public void setKey(int key) {
        this.key = key;
    }

    public String initGame(String xmlDescription, String creatorName, int key) throws Exception {
        this.key = key;
        this.creatorName = creatorName;
        this.registredNumOfPlayers = 0;
        loadGame(xmlDescription);

       // this.players = new ArrayList();
       // this.status = GameStatus.WaitingForPlayers;
       // this.initControllerData();
        return this.title;

    }

    public void loadGame(String inputStream) throws Exception {
        GameDescriptor gameDescriptor = null;

        gameDescriptor = game.XML_Handler.getGameDescriptorFromXml(inputStream);
        game.XML_Handler.validate(gameDescriptor);
        this.title = gameDescriptor.getDynamicPlayers().getGameTitle();
        this.requiredNumOfPlayers = gameDescriptor.getDynamicPlayers().getTotalPlayers();
        if (gameDescriptor != null) {
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
}
