package hello.Domain;

import javax.persistence.*;

@javax.persistence.Entity
@Table(name = "car")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Access(AccessType.PROPERTY)
    @Column(name="brand")
    private String brand;

    @Access(AccessType.PROPERTY)
    @Column(name="horsepower")
    private String horsePower;

    @Access(AccessType.PROPERTY)
    @Column(name="maxspeed")
    private Double maxSpeed;

    @Access(AccessType.PROPERTY)
    @Column(name="manufacturingyear")
    private Integer manufacturingYear;

    public Car(Integer id, String brand, String horsePower, Double maxSpeed, Integer manufacturingYear) {
        this.id = id;
        this.brand = brand;
        this.horsePower = horsePower;
        this.maxSpeed = maxSpeed;
        this.manufacturingYear = manufacturingYear;
    }

    @Override
    public String toString() {
        return brand;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getHorsePower() {
        return horsePower;
    }

    public void setHorsePower(String horsePower) {
        this.horsePower = horsePower;
    }

    public Double getMaxSpeed() {
        return maxSpeed;
    }

    public void setMaxSpeed(Double maxSpeed) {
        this.maxSpeed = maxSpeed;
    }

    public Integer getManufacturingYear() {
        return manufacturingYear;
    }

    public void setManufacturingYear(Integer manufacturingYear) {
        this.manufacturingYear = manufacturingYear;
    }

    public Car() {

    }
}
