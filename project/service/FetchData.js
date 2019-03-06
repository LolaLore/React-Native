const URI = 'http://192.168.22.109:8080/serverMobile';

export default {
    async fetchCars() {
        try {
            let response = await fetch(URI + '/all');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
        catch(e) {
            console.log(e)
        }
    }
}