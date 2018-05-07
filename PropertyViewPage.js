import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image} from 'react-native';
import { AsyncStorage } from 'react-native';

export default class PropertyViewPage extends Component {
  static navigationOptions = ({ navigation }) => {
    console.log("callback")
    const params = navigation.state.params || {};
   
    if (params.favButton) { 
          return {
               title:'Property View',
                headerRight: (
                  <Button
                  onPress={() => params.handleSave()}
                  title='Add'
                  />
                )   
          }}
          return {
            title:'Property View',
            headerRight: (
              <Button
              onPress={() => params.handleDelete()}
              title='Delete'
              />
            )  
          }    
  };

componentWillMount() {
  this._isFavorites();
  console.log("didmount")  
  this.props.navigation.setParams(
    { handleSave: this._saveFavorites.bind(this),
      handleDelete: this._deleteFavorites.bind(this)      
    }
  );
};

_isFavorites = () => {
  (async () => {
    let response = await AsyncStorage.getItem('favoList'); 
    let favoList = JSON.parse(response) || []; 
    let title = this.props.navigation.state.params.property.title;
     if (!~favoList.findIndex((item) => {return(item.title === title)})) 
        {
          this.props.navigation.setParams(
            {favButton: true}
          );              
        } else {
          this.props.navigation.setParams(
            {favButton: false}
          );
        }
  } )(); 
};

_deleteFavorites = () => {
  (async () => {
    let response = await AsyncStorage.getItem('favoList'); 
    let favoList = JSON.parse(response) || []; 
    let favorite = this.props.navigation.state.params.property;
    let indexItem = favoList.findIndex((item) => {return(item.title === favorite.title)});
    favoList.splice(indexItem, 1);
    AsyncStorage.setItem("favoList", JSON.stringify(favoList));    
    alert('Have deleted from Favorites List');
    this.props.navigation.setParams(
    { favButton: true      
    }
  );   
  } )();  
}

_saveFavorites = () => {
  (async () => {
    let response = await AsyncStorage.getItem('favoList'); 
    let favoList = JSON.parse(response) || []; 
    let newFavorite = this.props.navigation.state.params.property;
    favoList.push(newFavorite);
    AsyncStorage.setItem("favoList", JSON.stringify(favoList));
    alert('Have added to Favorites List');
    this.props.navigation.setParams(
    { favButton: false      
    }
  );    
  } )();  
}

  render() {
    const property = this.props.navigation.state.params.property;
    const price = property.price_formatted.split(' ')[0];

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: property.img_url }} />
        <View style={styles.heading}>
          <Text style={styles.price}>{price}</Text> 
          <Text style={styles.title}>{property.title}</Text> 
          <View style={styles.separator}/>
        </View>
        <Text style={styles.description}>{property.bedroom_number + ' bedroom ' + property.property_type}</Text>
        <Text style={styles.description}>{property.summary}</Text>   
       </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    marginTop: 5
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 300
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  }
});