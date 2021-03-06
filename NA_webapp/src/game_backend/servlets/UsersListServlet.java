package game_backend.servlets;

import game_backend.utils.ServletUtils;
import com.google.gson.Gson;
import game_backend.utils.SessionUtils;
import webEngine.users.User;
import webEngine.users.UserManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Set;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UsersListServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        switch (action){
            case "userslist":
                getUsersList(request, response);
                break;
            case "currentUserName":
                getCurrentUserName(request, response);
                break;
            case "currentUser":
                getCurrentUser(request, response);
                break;
        }
    }

    private void getUsersList(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //returning  JSON objects, not HTML
        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter()) {
            Gson gson = new Gson();
            UserManager userManager = ServletUtils.getUserManager(getServletContext());
            Set<User> usersList = userManager.getUsers();
            String json = gson.toJson(usersList);
            out.println(json);
            out.flush();
        }
    }

    private void getCurrentUserName(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter()) {
            Gson gson = new Gson();
            String currentUserName = SessionUtils.getUsername(request);
            if(currentUserName != ""){
                String json = gson.toJson(currentUserName);
                out.println(json);
                out.flush();
            }
            else {
                out.println(gson.toJson(null));
                out.flush();
//                response.sendRedirect("/pages/signup/signup.html");
            }
        }
    }

    private void getCurrentUser(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter()) {
            Gson gson = new Gson();
            String currentUserName = SessionUtils.getUsername(request);
            UserManager userManager = ServletUtils.getUserManager(getServletContext());
            Set<User> usersSet = userManager.getUsers();
            User currentUser = userManager.getUserByName(currentUserName);
            String json = gson.toJson(currentUser);
            out.println(json);
            out.flush();
        }
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
        processRequest(request, response);
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
        processRequest(request, response);
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
