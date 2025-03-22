import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator
} from 'react-native';
import React, { use, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';


const HomeScreen = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [coinData, setCoinData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/bitcoin?market_data=true')
      .then(response => {
        if (response.data && response.data.market_data && response.data.market_data.market_cap) {
          setCurrencyData(Object.keys(response.data.market_data.market_cap));
        } else {

          setCurrencyData(['USD', 'EUR', 'INR', 'GBP', 'JPY']);
          console.warn('Could not get currency data from API, using defaults');
        }
      })
      .catch(error => {
        console.error('Error fetching currency data:', error);

        setCurrencyData(['USD', 'EUR', 'INR', 'GBP', 'JPY']);
      });
  }, []);
  useEffect(() => {
    setIsLoading(true);

    axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selectedCurrency.toLowerCase()}`)
      .then((response) => {
        setCoinData(response.data);

        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [selectedCurrency]);

  const filterData = coinData.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handlePress = (item) => {
    console.log('data',item.id,selectedCurrency);
    navigation.navigate('CoinDetails', {
      id: item.id,
      currency:selectedCurrency
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const PriceChangeIndicator = ({ percentChange }) => {
    const isPositive = percentChange >= 0;
    return (
      <View style={[
        styles.priceChangeContainer,
        {backgroundColor: isPositive ? 'rgba(0, 179, 126, 0.1)' : 'rgba(255, 69, 58, 0.1)'}
      ]}>
        <Text style={[
          styles.priceChangeText,
          {color: isPositive ? '#00B37E' : '#FF453A'}
        ]}>
          {isPositive ? '+' : ''}{percentChange?.toFixed(2)}%
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={styles.coinItemContainer}
    >
      <View style={styles.coinItemLeft}>
        <Image source={{ uri: item.image }} style={styles.coinImage} />
        <View style={styles.coinInfo}>
          <Text style={styles.coinName}>{item.name}</Text>
          <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.coinItemRight}>
        <Text style={styles.coinPrice}>{formatPrice(item.current_price)}</Text>
        <PriceChangeIndicator percentChange={item.price_change_percentage_24h} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CoinX</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            placeholder="Search cryptocurrencies"
            value={searchInput}
            onChangeText={(text) => setSearchInput(text)}
            style={styles.searchInput}
            clearButtonMode='while-editing'
            placeholderTextColor="#8E8E93"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCurrency}
            onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
            style={styles.currencyPicker}
            dropdownIconColor="#333"
            mode='dropdown'

          >
            {currencyData.map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency}  />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeaderText}>Market</Text>
      </View>

      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2E5BFF" />
            <Text style={styles.loadingText}>Loading cryptocurrencies...</Text>
          </View>
        ) : (
          <FlatList
            data={filterData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Ionicons name="search" size={50} color="#8E8E93" />
                <Text style={styles.emptyListText}>No cryptocurrencies found</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E5BFF',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333333',
  },
  pickerContainer: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 80,
  },
  currencyPicker: {
    height: 44,
    width: 80,
  },
  listHeaderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  coinItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  coinItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  coinInfo: {
    marginLeft: 12,
  },
  coinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  coinSymbol: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  coinItemRight: {
    alignItems: 'flex-end',
  },
  coinPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  priceChangeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  priceChangeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F3F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyListContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyListText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
});