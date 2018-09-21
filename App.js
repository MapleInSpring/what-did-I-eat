/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, FlatList, Picker, StyleSheet, Text, TextInput, View} from 'react-native';
import firebase from 'react-native-firebase';

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {date: '', meal: '', type: '', meals: []};
        this.unsubscribe = null;

        this.ref = firebase.firestore().collection('meals');
    }

    uploadData() {
        const {meal, date, type} = this.state;
        console.warn(this.state);
        this.ref.add({meal, date, type})
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onMealsUpdate)
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
                <Text>Date</Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 200}}
                    onChangeText={(date) => this.setState({date})}
                    value={this.state.date}
                />
                <Text>Type</Text>
                <Picker
                    selectedValue={this.state.type}
                    style={{ height: 50, width: 200 }}
                    onValueChange={(itemValue) => this.setState({type: itemValue})}>
                    <Picker.Item label="Breakfast" value="Breakfast" />
                    <Picker.Item label="Lunch" value="Lunch" />
                    <Picker.Item label="Dinner" value="Dinner" />
                    <Picker.Item label="Snacks" value="Snacks" />
                </Picker>
                <Text>Meal</Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 200}}
                    onChangeText={(meal) => this.setState({meal})}
                    value={this.state.meal}
                />
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
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
