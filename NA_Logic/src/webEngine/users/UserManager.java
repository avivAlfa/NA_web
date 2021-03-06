package webEngine.users;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class UserManager {

    private final Set<User> usersSet;

    public UserManager() {
        usersSet = new HashSet<>();
    }

    public void addUser(String username, boolean isComputer) {
        User newUser = new User(username, isComputer);
        usersSet.add(newUser);
    }

    public void removeUser(String username) {
        usersSet.remove(getUserByName(username));

    }

    public Set<User> getUsers() {
        return Collections.unmodifiableSet(usersSet);
    }

    public boolean isUserExists(String username) {
        return usersSet.contains(getUserByName(username));
    }

    public User getUserByName(String username){
        for (User u:usersSet) {
            if(u.getUserName().equals(username))
                return u;
        }
        return null;
    }
}
