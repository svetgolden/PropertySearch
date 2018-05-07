import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity
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

export default class SearchResultsPage extends Component {
  static navigationOptions = {
    title: 'Results',
  };

    constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      pageNumber: 1,
      listings: this.props.navigation.state.params.listings
    }
    
  };

  _urlForQueryAndPage  = (key, value, pageNumber) => {
  const data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber,
  };
  data[key] = value;
  
  const querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'https://api.nestoria.co.uk/api?' + querystring;
}

   _executeQuery = (query) => {
      this.setState({ isLoading: true });
      fetch(query)
      .then(response => response.json())
        .then(json => this._handleResponse(json.response))
        .catch(error =>
          this.setState({
              isLoading: false,
              message: 'Something bad happened ' + error
          }));
  };

   _handleResponse = (response) => {
      this.setState({ isLoading: false , message: '' });
      if (response.application_response_code.substr(0, 1) === '1') {
            this.setState(
              prevState => {
                return {
                  listings: prevState.listings.concat(response.listings)
                };
              }
            );
      //console.log(this.state)
        
        } else {
        this.setState({ message: 'The location given was not recognised'});
      }
  };

  _onSearchPressed = (searchString) => {
    const newPageNunber = this.state.pageNumber+1
    this.setState({
      pageNumber: newPageNunber 
    })
      const query = this._urlForQueryAndPage('place_name', searchString, this.state.pageNumber);
      this._executeQuery(query);
      //console.log(query)
  };

  _keyExtractor = (item, index) => index;

  _renderItem = ({item, index}) => (
  <ListItem
    item={item}
    index={index}
    onPressItem={this._onPressItem}
    addFavorites={this._onFavoritesItem}
  />
);



_onPressItem = (item) => {
    this.props.navigation.navigate('PropertyView', {property: item})
};

  renderFooter(){
    const { params } = this.props.navigation.state;
    const paginationFooter = 
      (this.state.pageNumber < params.totalPages) 
      ? 
        (<View style = { styles.footer }>
          <TouchableOpacity activeOpacity = { 0.9 } onPress = {() => {this._onSearchPressed(params.placeName)}} style = { styles.loadMoreBtn }>
                
                {
                    ( this.state.isLoading )
                    ?
                        <ActivityIndicator color = "white" size='large'/>
                    :
                        <Text style = { styles.btnText }>Load More</Text>
                }
            </TouchableOpacity>                    
        </View>) 
      : 
        (<View></View>);

    return paginationFooter;
  }

  render() {
    const { params } = this.props.navigation.state;
    
    const paginationTitle = (this.state.pageNumber == params.totalPages+1) 
                            ?
                              (params.placeName + ' ' + params.totalResults % 20 + ' of ' +  params.totalResults) 
                            :
                              (params.placeName + ' ' + this.state.pageNumber*20 + ' of ' +  params.totalResults);
      
    return (
    <View style = { styles.container }>
    <Text style={styles.paginationTitle}>{paginationTitle}</Text>
      <FlatList
        data={this.state.listings}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent = { this.renderFooter.bind( this ) }
      />
      
    </View>
    );
  }
};


const styles = StyleSheet.create({
  container:
  {
    flex: 1,
   
  },
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
  paginationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center' 
  },
   footer:
  {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
   
  },
  loadMoreBtn:
  {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
 
  btnText:
  {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  }
});