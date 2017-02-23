package game;

public class PoolElement {
    int number;
    int color;

    public PoolElement() {}

    public PoolElement(int number, int color) {
        this.number = number;
        this.color = color;
    }

    public int getNumber() {
        return number;
    }

    public int getColor() { return color; }

    public void setColor(int color) { this.color = color; }


    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!PoolElement.class.isAssignableFrom(obj.getClass())) {
            return false;
        }
        final PoolElement other = (PoolElement) obj;

        if (this.number != other.number || this.color != other.color) {
            return false;
        }
        return true;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 53 * hash + this.number;
        hash += 53 * hash + this.color;
        return hash;
    }

}
