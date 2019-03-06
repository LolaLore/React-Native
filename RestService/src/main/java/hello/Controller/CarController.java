package hello.Controller;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import hello.Domain.Car;
import hello.Domain.User;
import hello.Repository.CarRepository;
import hello.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import net.minidev.json.JSONObject;
//import sun.security.krb5.internal.PAData;


import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Controller
@RequestMapping("/serverMobile")
public class CarController {
    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;
    int i = 6;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    JSONObject login(@RequestBody JSONObject user) {
        System.out.println("Try to login for :" + user.getAsString("username") + " : " + user.getAsString("password"));
        HashMap<String, String> response = new HashMap<String, String>();

        String username = user.getAsString("username");
        String password = user.getAsString("password");
        User user_found = userRepository.findByUsernameAndPassword(username, password);

        if (user_found != null) {
            response.put("response", "true");
            System.out.println("Succes to login for " + username + " : " + password);
        } else {
            response.put("response", "false");
            System.out.println("Failed to login for " + username + " : " + password);
        }
        return new JSONObject(response);
    }

    @RequestMapping(value = "/deleteCar", method = RequestMethod.POST)
    public @ResponseBody
    JSONObject deleteBook(@RequestBody JSONObject car) {
        System.out.println("Try to delete car  :" + car.getAsString("brand"));
        String brand = car.getAsString("brand");
        Boolean deleted = false;
        HashMap<String, String> response = new HashMap<String, String>();

        ArrayList<Car> cars = (ArrayList<Car>) carRepository.findAll();
        for (Car b : cars) {
            if (b.getBrand().equals(brand)) {
                carRepository.delete(b);
                deleted = true;
                break;
            }
        }
        if (deleted) {
            response.put("response", "true");
            System.out.println("Succes to delete for " + brand);
        } else {
            response.put("response", "false");
            System.out.println("Error to delete for " + brand);
        }
        return new JSONObject(response);
    }


    @RequestMapping(value = "/addCar", method = RequestMethod.POST)
    public @ResponseBody
    JSONObject addCar(@RequestBody JSONObject car) {
        System.out.println("Try to add car  :" + car.getAsString("brand") + " : " + car.getAsString("horsepower") + " : " + car.getAsString("maxspeed")  + " : " + car.getAsString("manufacturingyear"));
        HashMap<String, String> response = new HashMap<String, String>();

        String brand = car.getAsString("brand");
        String horsePower = car.getAsString("horsepower");
        Double maxSpeed = Double.valueOf(car.getAsString("maxspeed"));
        Integer manufacturingYear = Integer.valueOf(car.getAsString("manufacturingyear"));

        Car car_added = carRepository.save(new Car(i,brand,horsePower,maxSpeed,manufacturingYear));

        if (car_added != null) {
            response.put("response", "true");
            System.out.println("Succes to add for " + car_added.toString());
            i+=1;
        } else {
            response.put("response", "false");
            System.out.println("Error to add for " + car_added.toString());
        }

        return new JSONObject(response);
    }

    @ResponseBody
    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    public ResponseEntity<JSONObject> findAll() {
        List<Car> list = carRepository.findAll();

        JSONObject object=new JSONObject();

        object.put("number", 1);
        object.put("cars", list);
        System.out.println("done getAll");
        return new ResponseEntity<JSONObject>(object, HttpStatus.OK);
    }



    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public @ResponseBody
    JSONObject getAllMoviesRN() {
        HashMap<String, List<Car>> response = new HashMap<>();
        List<Car> cars = carRepository.findAll();

        response.put("cars", cars);
        return new JSONObject(response);
    }


    @RequestMapping(value = "/loginRN", method = RequestMethod.POST)
    ResponseEntity<?> loginRN(@RequestBody User user) {
        System.out.println("Login: " + user.getUsername() + " " + user.getPassword());
        String errors = "";
        if (userRepository.findByUsername(user.getUsername()) == null) {
            errors += "This email is not registered in the system;";
            System.out.println("1");
        } else {
            User logged = userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword());
            if (logged == null) {
                errors += "Email and password doesn't match.";
                System.out.println("2");
            } else {
                System.out.println("true " + HttpStatus.OK);
                return new ResponseEntity<>("true", HttpStatus.OK);

            }
        }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

}
