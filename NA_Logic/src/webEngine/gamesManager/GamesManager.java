package webEngine.gamesManager;

import game.GameEngine;

import java.util.ArrayList;

import javax.xml.bind.JAXBException;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

public class GamesManager {
    Integer numberOfGames;
    HashMap<Integer, GameObject> games;


    public GameObject getGameByKey(int key) {
        return games.get(key);
    }

    public ArrayList<GameObject> getGamesList() {
        return (ArrayList<GameObject>) games.values();
    }

    public void addGame(String xmlDescription, String creator) throws Exception {
        GameObject newGame = new GameObject();
        numberOfGames = Integer.valueOf(numberOfGames.intValue() + 1);
        String gameName = newGame.initGame(xmlDescription, creator, numberOfGames);
       // if(this.isGameNameTaken(gameName)) {
        //    throw new InvalidGameDataException("Game title is already in use.");
        //} else {
            Integer key = numberOfGames;
          //  int key1 = this.getMapKey();
            newGame.setKey(key);
            this.games.put(Integer.valueOf(key), newGame);
       // }
    }


}
