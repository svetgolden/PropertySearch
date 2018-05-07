import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
} from 'react-native';

import { AsyncStorage } from 'react-native';

class ListItem extends React.PureComponent {

  _onPress = () => {
    this.props.onPressItem(this.props.item);
  }

  render() {
    const item = this.props.item;
    const price = item.price_formatted.split(' ')[0];
    return (
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: item.img_url }} />
            <View style={styles.textContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.title}
                numberOfLines={1}>{item.title}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
      
    );
  }
};

export default class FavoritePage extends Component {
  static navigationOptions = {
    title: 'Favorites',
  };

  constructor(props){
    super(props);
    this.state = { 
       
    }    
  };

componentDidMount =  () => { 
  (async () => {
    let response = await AsyncStorage.getItem('favoList'); 
    let favoList = JSON.parse(response) ; 
    if (favoList[0]) {
    this.setState({ 
        favoList
    }); }
  } )()
};

_keyExtractor = (item, index) => index;

_renderItem = ({item, index}) => (
  <ListItem
    item={item}
    index={index}
    onPressItem={this._onPressItem}
  />
);

_onPressItem = (item) => {
    this.props.navigation.navigate('PropertyView', {property: item})
};

  render() {
    return (
     (this.state.favoList) ? <FlatList
        data={this.state.favoList}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      /> :  <Text>You have not added any properties to your favourites</Text>

     
    );
  }
};

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
});