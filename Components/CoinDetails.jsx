import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CoinDetails = ({route}) => {
    const[id,currency] = route.params;
  return (
    <View style = {styles.container}>
        <View style={styles.coinimg}>  <Image style={styles.coinimg} source={{uri:coinData.image}}/></View>
        <View style={styles.coininfo}>
            <Text style = {styles.textdetails}>Rank: {coinData.market_cap_rank}</Text>
            <Text  style = {styles.textdetails}>Current Price: ${coinData.market_data.current_price.usd}</Text>
            <Text  style = {styles.textdetails}>Name: {coinData.name}</Text>
            <Text  style = {styles.textdetails}>Description: {coinData.description.en}</Text>
        </View>




    </View>
  )
}

export default CoinDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinimg: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    coininfo: {
        padding: 10,
    },
    textdetails: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    }
})