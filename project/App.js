import React from 'react';
import {Button, View, Text, ScrollView, ListView, Linking} from 'react-native';
import {
    StyleSheet,
    TextInput,
    Alert,
    FlatList,
    ProgressBarAndroid,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
//import { Fumi } from 'react-native-textinput-effects';

import {
    Platform,
    Animated,
    Image,
    TouchableWithoutFeedback,
    TouchableHighlight,
} from 'react-native';
import {createAppContainer, createStackNavigator} from 'react-navigation'; // Version can be specified in package.json
import Pie from 'react-native-pie';


class HomeScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: '', loading: false, disabled: false
        }
    }

    render() {
        return (
            <View style={{flex: 1, padding: 10}}>
                <TextInput
                    style={{height: 40}}
                    placeholder="Username"
                    onChangeText={username => this.setState({username})}
                />
                <TextInput
                    style={{height: 40}}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={password => this.setState({password})}
                />
                <TouchableOpacity
                    // onPress={() => this.props.navigation.navigate('UserArea')}
                    onPress={() => this.login()}
                    style={{width: 200, padding: 10, alignItems: 'center'}}>
                    <Text style={{color: 'blue'}}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    login = () => {
        const {username, password} = this.state;
        let usrname;
        let pass;
        AsyncStorage.getItem('username').then((username) => {
            usrname = username.slice(0, username.indexOf(','));
            pass = username.slice(username.indexOf(',') + 1, username.length);
            console.log("first")
            console.log(usrname);
            console.log(pass);
            if (usrname === this.state.username && pass === this.state.password) {
                console.log("in if")
                this.props.navigation.navigate('UserArea');
            } else {
                alert("Username or password is wrong or please check the connection to internet!")
                fetch('http://192.168.43.181:8080/serverMobile/loginRN', {
                    method: 'POST',
                    headers:
                        {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    body: JSON.stringify(
                        {
                            username: this.state.username,

                            password: this.state.password,

                        })

                }).then((response) => {
                    //console.log(response.status);
                    //console.log(response);
                    console.log("second")
                    console.log(username + " " + password);

                    if (response.status == 200) {
                        alert("Logare cu succes");
                        let params = {'username': this.state.username, 'password': this.state.password};
                        AsyncStorage.setItem('username', params['username'] + ',' + params['password'], () => {
                            this.props.navigation.navigate('UserArea');
                        });

                    } else {
                        alert("Username sau parola gresite!")
                    }
                })
                    .catch((error) => {
                        console.error(error);
                    });
                // Keyboard.dismiss();
            }

        });


    }
}


class UserScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            dataSource: []
        }

        console.log('constructor:')
        AsyncStorage.getAllKeys().then((ks) => {
            console.log(ks);
        })
        this.load_items_from_storage();
    }

    renderItem = ({item}) => {
        return (<View>
            <View>
                <Text>
                    {item.brand}
                </Text>
                <Text>
                    {item.horsepower}
                </Text>
                <Text>
                    {item.maxspeed}
                </Text>
                <Text>
                    {item.manufacturingyear}
                </Text>
            </View>
        </View>)
    }

    componentDidMount() {
        var titles = [];
        fetch('http://192.168.43.181:8080/serverMobile/all')
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log(responseJson);
                this.setState({
                    dataSource: responseJson.cars
                });

                for(let i=0;i<this.dataSource.length;i++)
                    AsyncStorage.setItem('cars', this.state.dataSource[i]+',', () => {

                    });

            }).catch((error) => {
                console.log(error)
            })
    }

    load_items_from_storage = () => {
        var list = [];
        AsyncStorage.getItem("cars").then((cars) => {
            list = cars.split(',');
            this.setState(list);

        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topComponent}>
                    <Text>Car list</Text>
                </View>
                <View style={styles.centerComponent}>

                    <FlatList
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                    />
                </View>
                <Button
                    title="Statistics"
                    onPress={() => this.props.navigation.navigate('Chart')}
                />
                <Text style={{alignItems: 'center', justifyContent: 'center'}}>Hello user</Text>
                <View style={styles.bottomComponent}>
                    <Button
                        title="Add"
                        onPress={() => this.props.navigation.navigate('Add')}
                    />
                    <Button
                        title="Logout"
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <Button
                        title="Animation"
                        onPress={() => this.props.navigation.navigate('Anmatie')}
                    />
                    <Button
                        onPress={() => Linking.openURL('mailto:basket_lore@yahoo.com?subject=SendMail&body=I just send an email from my app') }
                        title="Send Email"
                    />
                </View>
            </View>
        );
    }

}

class AnimationScreen extends React.Component {
    state = {
        animatePress: new Animated.Value(1)
    }

    animateIn() {
        Animated.timing(this.state.animatePress, {
            toValue: 1.3,
            duration: 400
        }).start()
    }

    animateOut() {
        Animated.timing(this.state.animatePress, {
            toValue: 1,
            duration: 400
        }).start()
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPressIn={() => this.animateIn()} onPressOut={() => this.animateOut()}>
                    <Animated.View style={{
                        transform: [
                            {
                                scale: this.state.animatePress
                            }
                        ]
                    }}>
                        <Image style={{width: 300, height: 170, alignSelf: 'center', padding: 50, margin: 50}}
                               source={require('./assets/images/photo.jpg')}></Image>

                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}


class AddScreen extends React.Component {

    constructor() {
        super();

        this.state = {brand: '', horsepower: '', maxspeed: '', manufacturingyear: '', loading: false, disabled: false}
    }

    saveData = () => {
        this.setState({loading: true, disabled: true}, () => {
            fetch('http://192.168.100.9:8080/serverMobile/addCar',
                {
                    method: 'POST',
                    headers:
                        {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    body: JSON.stringify(
                        {
                            brand: this.state.brand,

                            horsepower: this.state.horsepower,

                            maxspeed: this.state.maxspeed,

                            manufacturingyear: this.state.manufacturingyear,

                        })

                }).then((response) => response.json()).then((responseJson) => {
                //alert(responseJson);
                this.setState({loading: false, disabled: false});
            }).catch((error) => {
                console.error(error);
                this.setState({loading: false, disabled: false});
            });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topComponent}>
                    <Text>Add car</Text>

                </View>
                <TextInput
                    style={{height: 40}}
                    placeholder="Car brand"
                    onChangeText={(text) => this.setState({brand: text})}
                />
                <TextInput
                    style={{height: 40}}
                    placeholder="Horse Power"
                    onChangeText={(text) => this.setState({horsepower: text})}
                />
                <TextInput
                    style={{height: 40}}
                    placeholder="Max speed"
                    onChangeText={(text) => this.setState({maxspeed: text})}
                />
                <TextInput
                    style={{height: 40}}
                    placeholder="Manufacturing year"
                    onChangeText={(text) => this.setState({manufacturingyear: text})}
                />
                <Button
                    title="Submit add"
                    onPress={() => this.saveData()}
                />
                <ProgressBarAndroid
                    styleAttr="LargeInverse"
                    progress={0.5}
                />
            </View>
        );
    }
}

class ChartAScreen extends React.Component {
    render() {
        let colorsL = ['#f00', '#0f0', '#00f', '#ff0', '#f0f'];
        return (
            <View style={styles.container}>
                <Pie
                    radius={70}
                    //completly filled pie chart with radius 70
                    innerRadius={15}
                    //to make donut pie chart define inner radius
                    series={[35, 20, 14, 16, 15]}
                    //values to show and color sequentially
                    colors={['#f00', '#0f0', '#00f', '#ff0', '#f0f']}
                />
                <FlatList
                    data={[
                        {key: 'Ford Mustang'},
                        {key: 'Ford Shelby'},
                        {key: 'Lexus'},
                        {key: 'Chevrollete'},
                        {key: 'Camaro'},
                    ]}
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) => (
                        <View style={{backgroundColor: colorsL[index]}}>
                            <Text style={styles.listStyle}>{item.key}</Text>
                        </View>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    btn: {
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        padding: 20,
    },
    topComponent: {
        flexDirection: 'row',
    },
    bottomComponent: {
        bottom: 0,
        flexDirection: 'row',

    },
    centerComponent: {},
    listStyle: {
        flex: 1,
    },
    flatview: {
        justifyContent: 'center',
        paddingTop: 30,
        borderRadius: 2,
    },
    contentScroll: {
        backgroundColor: '#E1D7D8',
        padding: 20,
        // justifyContent: 'center',
        flexDirection: 'column',
        flexGrow: 1
    },

    logoView: {
        padding: 20,
        alignSelf: 'center',
    },
    loginText: {
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        color: '#595856',
        fontSize: 40,
        alignSelf: 'center',
        paddingBottom: 50
    },

    container: {
        paddingBottom: 10,
    },

    link: {
        color: 'blue',
        alignSelf: 'center',
        fontSize: 20,
        fontFamily: 'Verdana'
    }

});

const RootStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        UserArea: {
            screen: UserScreen,
        },
        // Users: {
        //     //screen: UserScreen,
        //     screen: UserArea,
        // },
        Add: {
            screen: AddScreen,
        },
        Chart: {
            screen: ChartAScreen,
        },
        Anmatie: {
            screen: AnimationScreen,
        }

    },
    {
        initialRouteName: 'Home',
    }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return <AppContainer/>;
    }
}
