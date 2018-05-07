import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, TouchableOpacity, ScrollView} from 'react-native';
import { AsyncStorage } from 'react-native';

let instructionText = 'Use the form below to search for houses to buy. You can search by place-name, postcode, or click ""My location"", to search in your current location!';

function urlForQueryAndPage(key, value, pageNumber) {
  const data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber,
  };
  data[key] = value;
  console.log(data.page)

  const querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'https://api.nestoria.co.uk/api?' + querystring;
}

export default class PropertySearchPage extends Component{

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title:'Property Cross',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Favorites')}
          title="Favorites"
        />
      ),
    };
  };

  constructor(props){
    super(props);
    this.state = {
      searchString: '',
      isLoading: false,
      queryesList: [],
      
    }
  };
   
  componentDidMount =  () => { 
    (async () => {
      let response = await AsyncStorage.getItem('lastQueryesLi'); 
      let queryesList = JSON.parse(response) || []; 

      this.setState({ 
        queryesList
      }); 

    } )()
  }; 

  _saveQuery = (text, number) => {
    const textNumber = text + ' ' + number;
    if (this.state.queryesList.length>4) this.state.queryesList.shift();
    if (!~this.state.queryesList.join().indexOf(text)) {
      this.setState(
        prevState => {
            return {
              queryesList: prevState.queryesList.concat(textNumber)
            };
        },() => {
            AsyncStorage.setItem("lastQueryesLi", JSON.stringify(this.state.queryesList));
          }
      );
    } 
  }

  _onSearchTextChanged = (event) => {
    this.setState({searchString: event.nativeEvent.text });
  };

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

  _onSearchPressed = () => {
      const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
      this._executeQuery(query);
      this.setState({placeName: this.state.searchString})
  };

  _onQueryesTextPressed = (event, text) => {
    const textCity = text.slice(0, text.indexOf(' '));
    this.setState({placeName: textCity})
    const query = urlForQueryAndPage('place_name', textCity, 1);
    this._executeQuery(query);
    this.setState({searchString: ''})
  };

  _handleResponse = (response) => {
      this.setState({ isLoading: false , message: ''});
      if (response.application_response_code.substr(0, 1) === '1') {
        this.props.navigation.navigate('Results', {listings: response.listings, totalResults: response.total_results, placeName: this.state.placeName, totalPages: response.total_pages});
        if (this.state.searchString) {
          this._saveQuery(this.state.searchString, response.total_results);
        }
      } else {
        this.setState({ message: 'The location given was not recognised'});
      }this.setState({searchString: ''});
  };

  queriesOutput() {    
    return this.state.queryesList.map((name, key) => {
      return(
        <Text style={styles.queriesText} key={key}  onPress={(e) => this._onQueryesTextPressed(e, name)}>{name}</Text>
      )
    })
  };

  render(){
    const spinner = this.state.isLoading ? 
    <ActivityIndicator size='large'/> : null;

    const listings = (!this.state.isLoading && !this.state.message) ?(
      <View style={styles.container}>
        <Text style={styles.description}> Rescent Searches</Text>
        <View style={styles.queriesOutput}>
          {this.queriesOutput()}
        </View>
      </View>) : null;
    
    return(
    <View>
      <View style={styles.container}>

        <Text style={styles.description}>
          {instructionText}
        </Text>
        
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            placeholder='Newcastle'
            underlineColorAndroid={'transparent'}
            value={this.state.searchString}
            onChange={this._onSearchTextChanged}
          />
          <Button
            title='Go'
            onPress={this._onSearchPressed}
          />          
        </View>
        <Button
            title='My location'
            onPress={()=>{}}
          />
      </View>
        <Text style={styles.description}>{this.state.message}</Text> 
        {spinner}
        {listings}
    </View>     
    )
  }
};


const styles = StyleSheet.create({
  description: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'left',
    color: '#656565'
  },
  container: {
    padding: 10,
    marginTop: 0,
    alignItems: 'baseline'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  searchInput: {    
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
    flexGrow: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 3,
    color: '#48BBEC',
  },
  queriesOutput:{
   borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 3,
    minWidth: 300, 
    padding: 5,
    
  },
  queriesText:{
    color: '#48BBEC',
    fontSize: 16,
    marginBottom: 3,
    marginTop: 3,

  }
});