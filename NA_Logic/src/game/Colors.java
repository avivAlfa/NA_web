package game;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Colors {

    public static String getColor(int playerColor) {
        InputStream is = Colors.class.getClassLoader().getResourceAsStream("resources/colors.properties");
        Properties prop = new Properties();

        try {
            prop.load(is);
        } catch (IOException e) {

        }
        return prop.getProperty(Integer.toString(playerColor));
    }
}
