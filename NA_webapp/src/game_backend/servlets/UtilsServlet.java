package game_backend.servlets;

import Exceptions.CellOutOfBoundsException;
import com.google.gson.Gson;

import game.Colors;
import game_backend.utils.SessionUtils;
import webEngine.gamesManager.*;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@WebServlet(
        name = "UtilsServlet",
        urlPatterns = {"/utils"}
)
public class UtilsServlet extends HttpServlet{

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

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
            case "colors":
                getColors(request, response);
                break;
        }

    }
    private void getColors(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");

        List<String> colors = new ArrayList<>();
        for(int i = 0;i < 7;i++){
            colors.add(Colors.getColor(i));
        }

        out.println(gson.toJson(colors));
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
//        String action = request.getParameter("action");
//        switch (action){
//            case "loadGame":
//                loadGameAction(request, response);
//                break;
//            case "currentUser":
//                getCurrentUser(request, response);
//                break;
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