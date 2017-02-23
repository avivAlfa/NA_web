package game_backend.servlets;

import Exceptions.CellOutOfBoundsException;
import com.google.gson.Gson;

import webEngine.gamesManager.GameObject;
import webEngine.gamesManager.GamesManager;

import webEngine.gamesManager.LoadGameStatus;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Set;

@WebServlet(
        name = "GamesServlet",
        urlPatterns = {"/games"}
)
public class GamesServlet extends HttpServlet{
    GamesManager gamesManager = new GamesManager();

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {


//        String action = request.getParameter("action");
//        switch (action){
//            case "userslist":
//                getUsersList(request, response);
//                break;
//            case "currentUser":
//                getCurrentUser(request, response);
//                break;
//        }
//
//    }
//
//    private void getUsersList(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//        //returning  JSON objects, not HTML
//        response.setContentType("application/json");
//        try (PrintWriter out = response.getWriter()) {
//            Gson gson = new Gson();
//            UserManager userManager = ServletUtils.getUserManager(getServletContext());
//            Set<String> usersList = userManager.getUsers();
//            String json = gson.toJson(usersList);
//            out.println(json);
//            out.flush();
//        }
//    }
//
//    private void getCurrentUser(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//
//        response.setContentType("application/json");
//        try (PrintWriter out = response.getWriter()) {
//            Gson gson = new Gson();
//            String currentUser = SessionUtils.getUsername(request);
//            String json = gson.toJson(currentUser);
//            out.println(json);
//            out.flush();
//        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //processRequest(request, response);
        String action = request.getParameter("action");
        switch (action) {
            case "gameDetail":
                getGameDetails(request, response);
                break;
            case "joinGame":
                joinGame(request, response);
                break;
            case "gamesList":
                getGamesList(request, response);
                break;


        }

    }

    private void getGamesList(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");


        out.println(gson.toJson(this.gamesManager.getGamesList()));
        //return GamesManager.getGamesList();
    }

    private void joinGame(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    private void getGameDetails(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int key = Integer.parseInt(request.getParameter("key"));
        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        if(key != -1) {
            GameObject game = this.gamesManager.getGameByKey(key);
            out.println(gson.toJson(game));
        } //TODO else?

    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        switch (action){
            case "loadGame":
                loadGameAction(request, response);
                break;
//            case "currentUser":
//                getCurrentUser(request, response);
//                break;
        }
    }

    private void loadGameAction(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String gameContent = request.getParameter("file");
        String gameCreator = request.getParameter("creator");
        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");

        try {
            this.gamesManager.addGame(gameContent, gameCreator);
            out.println(gson.toJson(new LoadGameStatus(true, "")));


        } catch (CellOutOfBoundsException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.CursorCellException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.DuplicateCellException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.InvalidBoardSizeException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.InvalidRangeException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.InvalidRangeCompareToBoardSizeException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.InvalidRangeValuesException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.InvalidNumberOfColorsException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.InvalidNumberOfPlayersException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.InvalidNumberOfIDsException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (Exceptions.InvalidPlayerTypeException e) {
            out.println(gson.toJson(new LoadGameStatus(false, e.getMessage())));
        } catch (FileNotFoundException e) {
            out.println(gson.toJson(new LoadGameStatus(false, "File not found!")));
        } catch (JAXBException e) {
            if (!gameContent.endsWith(".xml"))
                out.println(gson.toJson(new LoadGameStatus(false, "The file you asked for isn't a xml file!")));
            else
            out.println(gson.toJson(new LoadGameStatus(false, "Error trying to retrieve data from XML file")));
        } catch (Exception e) {
            out.println(gson.toJson(new LoadGameStatus(false, "An unhandled error occured")));
        }
//            out.println(gson.toJson(new LoadGameStatus(true, "")));
//        } catch (Exception var8) {
//            out.println(gson.toJson(new LoadGameStatus(false, var8.getMessage())));
//        }

    }


    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}