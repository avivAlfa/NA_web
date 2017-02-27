package webEngine.gamesManager;

import game.GameEngine;

import java.io.InputStream;
import java.util.*;

import javax.xml.bind.JAXBException;
import java.io.IOException;
import java.util.stream.Collectors;

public class GamesManager {
    Integer numberOfGames = 0;
    HashMap<Integer, GameObject> games = new HashMap<Integer, GameObject>();


    public GameObject getGameByKey(int key) {
        return games.get(key);
    }

    public List<GameObject> getGamesList() {
//        return (List<GameObject>) games.values();
//        return (List)this.games.entrySet().stream().map((entry) -> {
//            return (GameObject)entry.getValue();
//        }).collect(Collectors.toList());

        return (List)this.games.entrySet().stream().map((entry) -> {
            return (GameObject)entry.getValue();
        }).filter((game) -> {
            return game.getGameStatus().equals(GameStatus.WaitingForPlayers);
        }).collect(Collectors.toList());
    }

    public void addGame(String xmlDescription, String creator) throws Exception {
        GameObject newGame = new GameObject();

        String gameName = newGame.initGame(xmlDescription, creator, Integer.valueOf(numberOfGames.intValue() + 1));
        numberOfGames = Integer.valueOf(numberOfGames.intValue() + 1);
       // if(this.isGameNameTaken(gameName)) {
        //    throw new InvalidGameDataException("Game title is already in use.");
        //} else {
            Integer key = numberOfGames;
          //  int key1 = this.getMapKey();
            newGame.setKey(key);
            this.games.put(Integer.valueOf(key), newGame);
       // }
    }

    public GameObject getGameByUserName(String userName) {
//        GameObject[] result = new GameController[1];
//        this.games.forEach((key, game) -> {
//            if(game.hasPlayerWithName(userName)) {
//                result[0] = game;
//            }
//
//        });
//        return result[0];
        for(Map.Entry<Integer, GameObject> gameEntry : this.games.entrySet()) {
            GameObject game = gameEntry.getValue();
            if(game.containsUserName(userName))
                return game;
        }
        return null;
    }

    public boolean isUserNameRegisteredToAnyOtherGame(String userName, GameObject currentGame) {
        for (Map.Entry<Integer, GameObject> gameEntry : this.games.entrySet()) {
            GameObject game = gameEntry.getValue();
            if (game != currentGame) {
                if (game.containsUserName(userName))
                    return true;
            }
        }
        return false;
    }
}
