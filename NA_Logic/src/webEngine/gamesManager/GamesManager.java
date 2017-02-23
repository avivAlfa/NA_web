package webEngine.gamesManager;

import game.GameEngine;

import java.util.ArrayList;
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
}
