package hello.Domain;

import java.util.List;

public class Page {
    private int number;
    private List<Car> cars;

    public Page(int number, List<Car> cars) {
        this.number = number;
        this.cars = cars;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public List<Car> getCars() {
        return cars;
    }

    public void setCars(List<Car> cars) {
        this.cars = cars;
    }
}

