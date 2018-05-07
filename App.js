import {StackNavigator, TabNavigator} from 'react-navigation';
import PropertySearchPage from './PropertySearchPage';
import SearchResultsPage from './SearchResultsPage';
import FavoritePage from './FavoritePage';
import PropertyViewPage from './PropertyViewPage';


const App = StackNavigator({
  Home: { screen: PropertySearchPage },
  Results: { screen: SearchResultsPage },
  Favorites: { screen: FavoritePage },
  PropertyView: { screen: PropertyViewPage}
},

{
  initialRouteName: 'Home',
    
  navigationOptions: {
      
  }
}

);

export default App;