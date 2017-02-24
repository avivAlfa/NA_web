package webEngine.users;

/**
 * Created by NofarD on 2/23/2017.
 */
public class User {

    private String userName;
    private boolean isComputer;

    public User(String userName, boolean isComputer) {
        this.isComputer = isComputer;
        this.userName = userName;
    }

    public String getUserName() {
        return userName;
    }
}
