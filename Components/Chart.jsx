import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import moment from 'moment/moment';

const Chart = ({ data, currency, isLoading }) => {
  // Skip points for cleaner chart appearance
  const skipPoints = (num) => {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      if (i % num === 0) {
        continue;
      }
      arr.push(i);
    }
    return arr;
  };

  // Format date/time for x-axis with better clarity
  const formatDate = (timestamp) => {
    // Get number of data points to determine appropriate format
    const dataLength = data.length;

    // If we have hourly data (short timeframe)
    if (dataLength < 48) {
      return moment(timestamp).format('HH:mm');
    }
    // If we have daily data (medium timeframe)
    else if (dataLength < 90) {
      return moment(timestamp).format('DD MMM');
    }
    // If we have weekly/monthly data (long timeframe)
    else {
      return moment(timestamp).format('MMM YY');
    }
  };

  // Format y-axis values for better readability
  const formatYLabel = (value) => {
    // For large values, show in k format
    if (value >= 10000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    // For medium values, show fewer decimal places
    else if (value >= 100) {
      return value.toFixed(0);
    }
    // For small values, show more decimal places
    else if (value >= 1) {
      return value.toFixed(1);
    }
    // For very small values
    else {
      return value.toFixed(4);
    }
  };

  // Calculate which points to show based on data length
  const getOptimalSkipRate = () => {
    if (data.length > 200) return 20;
    if (data.length > 100) return 10;
    if (data.length > 50) return 5;
    return 3;
  };

  // If data is loading, show loading indicator
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  // If data is unavailable, show placeholder
  if (!data || data.length === 0) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Chart data not available</Text>
      </View>
    );
  }

  // Calculate min and max values for better Y axis scaling
  const prices = data.map(item => item[1]);
  const minValue = Math.min(...prices) * 0.99; // Add 1% padding below
  const maxValue = Math.max(...prices) * 1.01; // Add 1% padding above

  // Sample data at regular intervals if too many points
  const sampleData = () => {
    if (data.length <= 60) return data;

    // Sample at regular intervals
    const sampleRate = Math.ceil(data.length / 60);
    return data.filter((_, index) => index % sampleRate === 0);
  };

  const sampledData = sampleData();

  return (
    <View style={styles.container}>
      {/* Price indicators */}
      <View style={styles.priceIndicators}>
        <View style={styles.currentPrice}>
          <Text style={styles.indicatorLabel}>Current</Text>
          <Text style={styles.currentPriceValue}>
            {currency?.toUpperCase()} {data[data.length - 1][1].toFixed(2)}
          </Text>
        </View>
        <View style={styles.priceChange}>
          <Text style={styles.indicatorLabel}>Change</Text>
          <View style={styles.changeRow}>
            <Text
              style={[
                styles.changeValue,
                { color: data[0][1] < data[data.length - 1][1] ? '#16c784' : '#ea3943' }
              ]}
            >
              {data[0][1] < data[data.length - 1][1] ? '+' : ''}
              {((data[data.length - 1][1] - data[0][1]) / data[0][1] * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      <LineChart
        data={{
          labels: sampledData.map(item => formatDate(item[0])),
          datasets: [
            {
              data: sampledData.map(item => item[1]),
              color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
              strokeWidth: 2,
            }
          ]
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel={currency === 'usd' ? '$' : ''}
        yAxisSuffix={currency !== 'usd' ? ` ${currency?.toUpperCase()}` : ''}
        withInnerLines={false}
        withOuterLines={true}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        withDots={false}
        withShadow={false}
        withVerticalLines={false}
        verticalLabelRotation={30}  // Rotate labels for better readability
        xLabelsOffset={-10}
        hidePointsAtIndex={skipPoints(getOptimalSkipRate())}
        formatYLabel={formatYLabel}
        fromZero={false}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#0066cc",
          },
          propsForBackgroundLines: {
            strokeDasharray: "5, 5",
            stroke: "#efefef",
          },
          propsForVerticalLabels: {
            fontSize: 10,
            rotation: -30,
          },
          propsForHorizontalLabels: {
            fontSize: 10,
          },
          // Set min and max values to have better scaling
          min: minValue,
          max: maxValue,
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  placeholderContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  priceIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currentPrice: {
    alignItems: 'flex-start',
  },
  priceChange: {
    alignItems: 'flex-end',
  },
  indicatorLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  currentPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Chart;