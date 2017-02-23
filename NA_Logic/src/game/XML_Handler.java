package game;

import Exceptions.*;
import generated.GameDescriptor;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class XML_Handler {
    private final static String JAXB_XML_GAME_PACKAGE_NAME = "generated";

    public static GameDescriptor getGameDescriptorFromXml(String xml_path) throws Exception{
        GameDescriptor gameDescriptor = null;
        InputStream inputStream; //XML_Handler.class.getResourceAsStream("\\resources\\random.xml");
        try {
            inputStream = new FileInputStream(xml_path);
            gameDescriptor = deserializeFrom(inputStream);


        } catch (JAXBException e) {
            throw e;
        } catch (FileNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }

        return gameDescriptor;
    }

    private static GameDescriptor deserializeFrom(InputStream in) throws JAXBException {
        JAXBContext jc = JAXBContext.newInstance(JAXB_XML_GAME_PACKAGE_NAME);
        Unmarshaller u = jc.createUnmarshaller();
        return (GameDescriptor) u.unmarshal(in);
    }

    public static void validate(GameDescriptor gd) throws Exception {
        int boardSize = gd.getBoard().getSize().intValue();
        if(boardSize < 5 || boardSize > 50){
            throw new InvalidBoardSizeException();
        }

        if((gd.getBoard().getStructure().getType()).toLowerCase().equals("random")){
            if(gd.getGameType().equals("Basic"))
                validateBasicRandomBoard(gd);
            else
                validateAdvancedRandomBoard(gd);
        }else{
            validateExplicitBoard(gd);
        }
        if(gd.getGameType().equals("Advance"))
            validatePlayers(gd, true);
        else
            validatePlayers(gd, false);

    }

    private static void validateBasicRandomBoard(GameDescriptor gd) throws Exception{
        int rangeFrom = gd.getBoard().getStructure().getRange().getFrom();
        int rangeTo = gd.getBoard().getStructure().getRange().getTo();
        int boardSize = gd.getBoard().getSize().intValue();

        if(rangeTo - rangeFrom + 1 > Math.pow(boardSize,2) - 1 ){
            throw new InvalidRangeCompareToBoardSizeException();
        }

        if(rangeTo < rangeFrom){
            throw new InvalidRangeException();
        }

        if(rangeFrom < -99 || rangeTo > 99){
            throw new InvalidRangeValuesException();
        }
    }

    private static void validateAdvancedRandomBoard(GameDescriptor gd) throws Exception{
        int rangeFrom = gd.getBoard().getStructure().getRange().getFrom();
        int rangeTo = gd.getBoard().getStructure().getRange().getTo();
        int boardSize = gd.getBoard().getSize().intValue();

        if((rangeTo - rangeFrom + 1)*(gd.getPlayers().getPlayer().size()) > Math.pow(boardSize,2) - 1 ){
            throw new InvalidRangeCompareToBoardSizeException();
        }

        if(rangeTo < rangeFrom){
            throw new InvalidRangeException();
        }

        if(rangeFrom < -99 || rangeTo > 99){
            throw new InvalidRangeValuesException();
        }
    }

    private static void validateExplicitBoard(GameDescriptor gd) throws Exception{
        int boardSize = gd.getBoard().getSize().intValue();
        int currRow, currCol, currValue;
        PoolElement cell;
        Set<PoolElement> seenSquares = new HashSet<PoolElement>();
        List<GameDescriptor.Board.Structure.Squares.Square> squaresList = gd.getBoard().getStructure().getSquares().getSquare();
        GameDescriptor.Board.Structure.Squares.Marker marker = gd.getBoard().getStructure().getSquares().getMarker();

        for(int i = 0; i < squaresList.size(); i++){
            currRow = squaresList.get(i).getRow().intValue();
            currCol = squaresList.get(i).getColumn().intValue();
            currValue = squaresList.get(i).getValue().intValue();

            if((currRow > boardSize) || (currCol > boardSize)) {
                throw new CellOutOfBoundsException(currRow, currCol, currValue, boardSize);
            }

            cell = new PoolElement(currRow,currCol);
            if(seenSquares.contains(cell)){
                throw new DuplicateCellException(currRow, currCol, currValue);
            }else{
                seenSquares.add(cell);
            }
        }

        if(marker.getRow().intValue() > boardSize || marker.getColumn().intValue() > boardSize){
            throw new CursorOutOfBoundsException(marker.getRow().intValue(), marker.getColumn().intValue(), boardSize);
        }
    }

    private static void validatePlayers(GameDescriptor gd, boolean isAdvance)throws Exception{
        HashSet<BigInteger> playersIds = new HashSet<>();
        HashSet<Integer> playersColors = new HashSet<>();
        if(gd.getPlayers()!=null) {
            List<GameDescriptor.Players.Player> players = gd.getPlayers().getPlayer();


            for (GameDescriptor.Players.Player player : players) {
                if (!player.getType().equals("Human") && !player.getType().equals("Computer")) {
                    throw new InvalidPlayerTypeException();
                }
                if(isAdvance) {
                    playersIds.add(player.getId());
                    playersColors.add(player.getColor());
                }
            }
            if(isAdvance) {
                if(playersIds.size() != players.size()) {
                    throw new InvalidNumberOfIDsException();
                }
                if(playersColors.size() != players.size()) {
                    throw new InvalidNumberOfColorsException();
                }
                if(players.size() < 3 || players.size() > 6){
                    throw new InvalidNumberOfPlayersException();
                }
            }
            else{
                if(players.size() != 2){
                    throw new InvalidNumberOfPlayersException();
                }
            }

        }
    }

}
