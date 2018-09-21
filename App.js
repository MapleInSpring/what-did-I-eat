/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, FlatList, Picker, StyleSheet, Text, TextInput, View, Keyboard} from 'react-native';
import firebase from 'react-native-firebase';
import moment from 'moment';

type Props = {};
const getMealType = () => {

    const breakfastThreshold = moment().hour(11);
    const dinnerThreshold = moment().hour(16);
    const currentTime = moment();

    if (currentTime.isBefore(breakfastThreshold)) {
        return 'Breakfast';
    } else if (currentTime.isBefore(dinnerThreshold)) {
        return 'Lunch';
    } else {
        return 'Dinner';
    }
};
const getDefaultMeal = () => {
    return {
        type: getMealType(),
        date: moment().format('YYYY-MM-DD'),
        meal: '',
        meat: '',
        carbs: '',
        fibre: '',
        nuts: ''
    }
};

export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            ...getDefaultMeal(),
            meals: []
        };
        this.unsubscribe = null;

        this.ref = firebase.firestore().collection('meals');
    }

    uploadData() {
        Keyboard.dismiss();

        const {meal, date, type, meat, carbs, fibre, nuts} = this.state;
        this.ref.add({meal, date, type, meat, carbs, fibre, nuts})
            .then(() => {
                this.setState({
                    ...getDefaultMeal(),
                })
            })
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onMealsUpdate)
        this.setState({
            ...getDefaultMeal()
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onMealsUpdate = (mealCollection) => {
        const meals = [];

        mealCollection.forEach((doc) => {
            const {date, meal, type} = doc.data();

            meals.push({
                key: doc.id,
                date,
                meal,
                type
            });
        });

        this.setState({meals})
    };

    renderMealForm() {
        return (
            <View>
                <View style={styles.inputBox}>
                    <TextInput
                        style={[styles.inputBorder]}
                        onChangeText={(date) => this.setState({date})}
                        value={this.state.date}
                        placeholder={'Date'}
                    />
                </View>

                <View style={styles.inputBox}>
                    <View style={styles.inputBorder}>
                        <Picker
                            selectedValue={this.state.type}
                            onValueChange={(itemValue) => this.setState({type: itemValue})}>
                            <Picker.Item label="Breakfast" value="Breakfast"/>
                            <Picker.Item label="Lunch" value="Lunch"/>
                            <Picker.Item label="Dinner" value="Dinner"/>
                            <Picker.Item label="Snacks" value="Snacks"/>
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputBorder}
                        onChangeText={(meal) => this.setState({meal})}
                        value={this.state.meal}
                        placeholder={'Meal'}
                    />
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputBorder}
                        onChangeText={(meat) => this.setState({meat})}
                        value={this.state.meat}
                        placeholder={'Meat'}
                    />
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputBorder}
                        onChangeText={(carbs) => this.setState({carbs})}
                        value={this.state.carbs}
                        placeholder={'Carbs'}
                    />
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputBorder}
                        onChangeText={(fibre) => this.setState({fibre})}
                        value={this.state.fibre}
                        placeholder={'Fruits / Vegie'}
                    />
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputBorder}
                        onChangeText={(nuts) => this.setState({nuts})}
                        value={this.state.nuts}
                        placeholder={'Nuts'}
                    />
                </View>

                <Button onPress={() => this.uploadData(this)} title={'Save Meal'}/>
            </View>
        )
    }

    renderMealItem = (mealItem) => {
        const {date, meal, type} = mealItem;
        const formattedDate = date ? date : 'some day';

        return (
            <Text>{formattedDate + ' ' + meal + ' ' + type}</Text>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                {this.renderMealForm()}
                <FlatList
                    data={this.state.meals}
                    renderItem={({item}) => this.renderMealItem(item)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 15
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    inputBorder: {
        borderWidth: 1,
        borderColor: 'gray'
    },
    inputBox: {
        height: 50,
        width: 250,
        margin: 2
    }
});
