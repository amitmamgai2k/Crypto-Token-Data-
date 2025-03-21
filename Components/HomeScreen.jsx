import { Image, StyleSheet, Text, View,TouchableOpacity,FlatList,SafeAreaView,StatusBar, TextInput } from 'react-native'
import React,{useState} from 'react'


const cryptoData = [
  {
    "id": 1,
    "name": "Bitcoin",
    "price": 67725.50,
    "img": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  },
  {
    "id": 2,
    "name": "Ethereum",
    "price": 3492.30,
    "img": "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  },
  {
    "id": 3,
    "name": "Binance Coin",
    "price": 412.50,
    "img": "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png"
  },
  {
    "id": 4,
    "name": "Solana",
    "price": 143.75,
    "img": "https://assets.coingecko.com/coins/images/4128/large/solana.png"
  },
  {
    "id": 5,
    "name": "XRP",
    "price": 0.62,
    "img": "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"
  },
  {
    "id": 6,
    "name": "Cardano",
    "price": 0.74,
    "img": "https://assets.coingecko.com/coins/images/975/large/cardano.png"
  },
  {
    "id": 7,
    "name": "Dogecoin",
    "price": 0.12,
    "img": "https://assets.coingecko.com/coins/images/5/large/dogecoin.png"
  },
  {
    "id": 8,
    "name": "Polygon",
    "price": 1.02,
    "img": "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png"
  },
  {
    "id": 9,
    "name": "Polkadot",
    "price": 8.40,
    "img": "https://assets.coingecko.com/coins/images/12171/large/polkadot.png"
  },
  {
    "id": 10,
    "name": "Avalanche",
    "price": 39.60,
    "img": "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png"
  }
];
const HomeScreen = () => {
  const[searchInput,setSearchInput]=useState('');
  const filterData = cryptoData.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()));
  const renderItem = ({ item }) => (
    <TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent:'space-between' }}>
        <Image source={{ uri: item.img }} style={{ width: 50, height: 50 }} />
        <Text>{item.name}</Text>
        <Text>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.Text}>CoinX</Text>
      <TextInput placeholder="Search" style={{ borderWidth: 1, padding: 10, margin: 10, borderRadius: 5 }}  value={searchInput} onChangeText={(text) => setSearchInput(text)}/>
      <View style={{ flex: 1, padding: 10,justifyContent:'space-evenly'   }}>
        <FlatList
          data={cryptoData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: StatusBar.currentHeight,
  },
  Text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  }
});