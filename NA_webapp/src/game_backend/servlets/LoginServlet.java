package game_backend.servlets;

import com.google.gson.Gson;
import game_backend.constants.Constants;
import game_backend.utils.SessionUtils;
import game_backend.utils.ServletUtils;
import webEngine.users.UserManager;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static game_backend.constants.Constants.COMPUTER_PARAMETER;
import static game_backend.constants.Constants.USERNAME;

public class LoginServlet extends HttpServlet {

    // urls that starts with forward slash '/' are considered absolute
    // urls that doesn't start with forward slash '/' are considered relative to the place where this servlet request comes from
    // you can use absolute paths, but then you need to build them from scratch, starting from the context path
    // ( can be fetched from request.getContextPath() ) and then the 'absolute' path from it.
    // Each method with it's pros and cons...
    private final String CHAT_ROOM_URL = "../chatroom/chatroom.html";
    private final String SIGN_UP_URL = "../signup/signup.html";
    private final String LOBBY_URL = "../lobby/lobby.html";
    private final String LOGIN_ERROR_URL = "/pages/loginerror/login_attempt_after_error.jsp";  // must start with '/' since will be used in request dispatcher...
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        String usernameFromSession = SessionUtils.getUsername(request);
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        if (usernameFromSession == null) {
            //user is not logged in yet
            String usernameFromParameter = request.getParameter(USERNAME);
            if (usernameFromParameter == null || usernameFromParameter=="") {
                //no username in session and no username in parameter -
                //redirect back to the index page
                //this return an HTTP code back to the browser telling it to load
                response.sendRedirect(SIGN_UP_URL);
            } else {
                //normalize the username value
                usernameFromParameter = usernameFromParameter.trim();
                if (userManager.isUserExists(usernameFromParameter)) {
                    String errorMessage = "Username " + usernameFromParameter + " already exists. Please enter a different username.";
                    // username already exists, forward the request back to index.jsp
                    // with a parameter that indicates that an error should be displayed
                    // the request dispatcher obtained from the servlet context is one that MUST get an absolute path (starting with'/')
                    // and is relative to the web app root
                    // see this link for more details:
                    // http://timjansen.github.io/jarfiller/guide/servlet25/requestdispatcher.xhtml
                    request.setAttribute(Constants.USER_NAME_ERROR, errorMessage);
                    getServletContext().getRequestDispatcher(LOGIN_ERROR_URL).forward(request, response);
                } else {
                    //add the new user to the users list
                    String isComputerString = request.getParameter(COMPUTER_PARAMETER);
                    boolean isComputer = isComputerString==null?false:true;
                    userManager.addUser(usernameFromParameter,isComputer);
                    //set the username in a session so it will be available on each request
                    //the true parameter means that if a session object does not exists yet
                    //create a new one
                    request.getSession(true).setAttribute(Constants.USERNAME, usernameFromParameter);

                    //redirect the request to the game_backend room - in order to actually change the URL
                    //System.out.println("On login, request URI is: " + request.getRequestURI());
                    response.sendRedirect(LOBBY_URL);
                }
            }
        } else {
            //user is already logged in
            response.sendRedirect(LOBBY_URL);
        }
    }

    protected void isUserLoggedOn(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        String usernameFromSession = SessionUtils.getUsername(request);
        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        if (usernameFromSession == null) {
            //user is not logged in yet
            out.println(gson.toJson(false));
        } else {
            //user is already logged in
            out.println(gson.toJson(true));
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
        String action = request.getParameter("action");
        switch (action) {
            case "login":
                processRequest(request, response);
                break;
            case "checkUser":
                isUserLoggedOn(request,response);
                break;
        }

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
