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
        usersSet.add(new User(username, isComputer));
    }

    public void removeUser(String username) {
        usersSet.remove(username);
    }

    public Set<User> getUsers() {
        return Collections.unmodifiableSet(usersSet);
    }

    public boolean isUserExists(String username) {
        return usersSet.contains(username);
    }
}
