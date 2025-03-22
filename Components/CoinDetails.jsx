import { ActivityIndicator, Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from './Chart';
const CoinDetails = ({ route }) => {
    const [coinData, setCoinData] = useState({});
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [timeRange, setTimeRange] = useState('7'); // Default to 7 days

    const { id, currency } = route.params;

    useEffect(() => {
        setIsLoading(true);
        axios.get(`https://api.coingecko.com/api/v3/coins/${id}?market_data=true&community_data=true&developer_data=true&sparkline=true`)
            .then(response => {
                console.log('res', response.data);
                setCoinData(response.data);
            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));

        fetchChartData();
    }, [id, currency, timeRange]);

    const fetchChartData = async () => {
        try {
            setChartLoading(true);
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
                    params: {
                        vs_currency: currency || 'usd',
                        days: timeRange
                    }
                }
            );
            if (response.data && response.data.prices) {
                setChartData(response.data.prices);
            }
            setChartLoading(false);
        } catch (error) {
            console.error("Error fetching chart data:", error);
            setChartLoading(false);
        }
    };

    // Format large numbers with commas
    const formatNumber = (num) => {
        if (!num) return 'N/A';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Get color based on percentage change
    const getChangeColor = (change) => {
        if (!change && change !== 0) return '#666';
        return change >= 0 ? '#16c784' : '#ea3943';
    };

    // Format description by removing HTML tags
    const formatDescription = (desc) => {
        if (!desc) return 'No description available';
        const withoutTags = desc.replace(/<\/?[^>]+(>|$)/g, '');
        if (showFullDescription) return withoutTags;
        return withoutTags.length > 300 ? withoutTags.substring(0, 300) + '...' : withoutTags;
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0066cc" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Header Section with Image and Basic Info */}
                    <View style={styles.headerSection}>
                        {coinData.image && (
                            <View style={styles.imageWrapper}>
                                <Image
                                    style={styles.coinImage}
                                    source={{ uri: coinData.image.small }}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        <View style={styles.basicInfo}>
                            <Text style={styles.coinName}>{coinData.name || 'N/A'}</Text>
                            <Text style={styles.coinSymbol}>{coinData.symbol?.toUpperCase() || 'N/A'}</Text>
                            <View style={styles.rankBadge}>
                                <Text style={styles.rankText}>Rank #{coinData.market_cap_rank || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Price Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Price Information</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Current Price:</Text>
                            <Text style={styles.priceValue}>
                                ${coinData.market_data?.current_price?.[currency]
                                    ? formatNumber(coinData.market_data.current_price[currency])
                                    : 'N/A'} {currency?.toUpperCase()}
                            </Text>
                        </View>

                        {/* 24h Price Change */}
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>24h Change:</Text>
                            <Text style={[
                                styles.value,
                                {color: getChangeColor(coinData.market_data?.price_change_percentage_24h)}
                            ]}>
                                {coinData.market_data?.price_change_percentage_24h
                                    ? `${coinData.market_data.price_change_percentage_24h.toFixed(2)}%`
                                    : 'N/A'}
                            </Text>
                        </View>

                        {/* 24h High/Low */}
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>24h High:</Text>
                            <Text style={styles.value}>
                                ${coinData.market_data?.high_24h?.[currency]
                                    ? formatNumber(coinData.market_data.high_24h[currency])
                                    : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>24h Low:</Text>
                            <Text style={styles.value}>
                                ${coinData.market_data?.low_24h?.[currency]
                                    ? formatNumber(coinData.market_data.low_24h[currency])
                                    : 'N/A'}
                            </Text>
                        </View>
                    </View>

                    {/* Chart Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Price Chart</Text>

                        {/* Time Range Selector */}
                        <View style={styles.timeRangeSelector}>
                            <TouchableOpacity
                                style={[styles.timeButton, timeRange === '1' && styles.timeButtonActive]}
                                onPress={() => setTimeRange('1')}
                            >
                                <Text style={[styles.timeButtonText, timeRange === '1' && styles.timeButtonTextActive]}>1D</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.timeButton, timeRange === '7' && styles.timeButtonActive]}
                                onPress={() => setTimeRange('7')}
                            >
                                <Text style={[styles.timeButtonText, timeRange === '7' && styles.timeButtonTextActive]}>7D</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.timeButton, timeRange === '30' && styles.timeButtonActive]}
                                onPress={() => setTimeRange('30')}
                            >
                                <Text style={[styles.timeButtonText, timeRange === '30' && styles.timeButtonTextActive]}>1M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.timeButton, timeRange === '90' && styles.timeButtonActive]}
                                onPress={() => setTimeRange('90')}
                            >
                                <Text style={[styles.timeButtonText, timeRange === '90' && styles.timeButtonTextActive]}>3M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.timeButton, timeRange === '365' && styles.timeButtonActive]}
                                onPress={() => setTimeRange('365')}
                            >
                                <Text style={[styles.timeButtonText, timeRange === '365' && styles.timeButtonTextActive]}>1Y</Text>
                            </TouchableOpacity>
                        </View>

                        {chartLoading ? (
                            <View style={styles.chartLoadingContainer}>
                                <ActivityIndicator size="small" color="#0066cc" />
                                <Text style={styles.chartLoadingText}>Loading chart data...</Text>
                            </View>
                        ) : (
                            <Chart data={chartData} currency={currency} />
                        )}
                    </View>

                    {/* Market Data */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Market Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Market Cap:</Text>
                            <Text style={styles.value}>
                                ${coinData.market_data?.market_cap?.[currency]
                                    ? formatNumber(coinData.market_data.market_cap[currency])
                                    : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>24h Volume:</Text>
                            <Text style={styles.value}>
                                ${coinData.market_data?.total_volume?.[currency]
                                    ? formatNumber(coinData.market_data.total_volume[currency])
                                    : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Circulating Supply:</Text>
                            <Text style={styles.value}>
                                {coinData.market_data?.circulating_supply
                                    ? formatNumber(coinData.market_data.circulating_supply)
                                    : 'N/A'} {coinData.symbol?.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Max Supply:</Text>
                            <Text style={styles.value}>
                                {coinData.market_data?.max_supply
                                    ? formatNumber(coinData.market_data.max_supply)
                                    : 'Unlimited'} {coinData.symbol?.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Price Changes */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Price Changes</Text>
                        <View style={styles.changeGrid}>
                            <View style={styles.changeItem}>
                                <Text style={styles.changeLabel}>7d</Text>
                                <Text style={[
                                    styles.changeValue,
                                    {color: getChangeColor(coinData.market_data?.price_change_percentage_7d)}
                                ]}>
                                    {coinData.market_data?.price_change_percentage_7d
                                        ? `${coinData.market_data.price_change_percentage_7d.toFixed(2)}%`
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.changeItem}>
                                <Text style={styles.changeLabel}>14d</Text>
                                <Text style={[
                                    styles.changeValue,
                                    {color: getChangeColor(coinData.market_data?.price_change_percentage_14d)}
                                ]}>
                                    {coinData.market_data?.price_change_percentage_14d
                                        ? `${coinData.market_data.price_change_percentage_14d.toFixed(2)}%`
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.changeItem}>
                                <Text style={styles.changeLabel}>30d</Text>
                                <Text style={[
                                    styles.changeValue,
                                    {color: getChangeColor(coinData.market_data?.price_change_percentage_30d)}
                                ]}>
                                    {coinData.market_data?.price_change_percentage_30d
                                        ? `${coinData.market_data.price_change_percentage_30d.toFixed(2)}%`
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.changeItem}>
                                <Text style={styles.changeLabel}>1y</Text>
                                <Text style={[
                                    styles.changeValue,
                                    {color: getChangeColor(coinData.market_data?.price_change_percentage_1y)}
                                ]}>
                                    {coinData.market_data?.price_change_percentage_1y
                                        ? `${coinData.market_data.price_change_percentage_1y.toFixed(2)}%`
                                        : 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Additional Info */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Additional Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Genesis Date:</Text>
                            <Text style={styles.value}>
                                {formatDate(coinData.genesis_date)}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Hashing Algorithm:</Text>
                            <Text style={styles.value}>
                                {coinData.hashing_algorithm || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Block Time:</Text>
                            <Text style={styles.value}>
                                {coinData.block_time_in_minutes ? `${coinData.block_time_in_minutes} minutes` : 'N/A'}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>About {coinData.name}</Text>
                        <Text style={styles.description}>
                            {formatDescription(coinData.description?.en)}
                        </Text>
                        {coinData.description?.en && coinData.description.en.length > 300 && (
                            <TouchableOpacity
                                style={styles.readMoreButton}
                                onPress={() => setShowFullDescription(!showFullDescription)}
                            >
                                <Text style={styles.readMoreText}>
                                    {showFullDescription ? 'Show Less' : 'Read More'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Links */}
                    {coinData.links && (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Links</Text>
                            <View style={styles.linksContainer}>
                                {coinData.links.homepage && coinData.links.homepage[0] && (
                                    <View style={styles.linkItem}>
                                        <Text style={styles.linkLabel}>Website</Text>
                                        <Text style={styles.linkValue} numberOfLines={1}>
                                            {coinData.links.homepage[0]}
                                        </Text>
                                    </View>
                                )}
                                {coinData.links.blockchain_site && coinData.links.blockchain_site[0] && (
                                    <View style={styles.linkItem}>
                                        <Text style={styles.linkLabel}>Blockchain Explorer</Text>
                                        <Text style={styles.linkValue} numberOfLines={1}>
                                            {coinData.links.blockchain_site[0]}
                                        </Text>
                                    </View>
                                )}
                                {coinData.links.official_forum_url && coinData.links.official_forum_url[0] && (
                                    <View style={styles.linkItem}>
                                        <Text style={styles.linkLabel}>Official Forum</Text>
                                        <Text style={styles.linkValue} numberOfLines={1}>
                                            {coinData.links.official_forum_url[0]}
                                        </Text>
                                    </View>
                                )}
                                {coinData.links.subreddit_url && (
                                    <View style={styles.linkItem}>
                                        <Text style={styles.linkLabel}>Reddit</Text>
                                        <Text style={styles.linkValue} numberOfLines={1}>
                                            {coinData.links.subreddit_url}
                                        </Text>
                                    </View>
                                )}
                                {coinData.links.repos_url?.github && coinData.links.repos_url.github[0] && (
                                    <View style={styles.linkItem}>
                                        <Text style={styles.linkLabel}>GitHub</Text>
                                        <Text style={styles.linkValue} numberOfLines={1}>
                                            {coinData.links.repos_url.github[0]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Community Data */}
                    {coinData.community_data && (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Community</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Twitter Followers:</Text>
                                <Text style={styles.value}>
                                    {coinData.community_data.twitter_followers
                                        ? formatNumber(coinData.community_data.twitter_followers)
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Reddit Subscribers:</Text>
                                <Text style={styles.value}>
                                    {coinData.community_data.reddit_subscribers
                                        ? formatNumber(coinData.community_data.reddit_subscribers)
                                        : 'N/A'}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Developer Data */}
                    {coinData.developer_data && (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Development</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>GitHub Stars:</Text>
                                <Text style={styles.value}>
                                    {coinData.developer_data.stars
                                        ? formatNumber(coinData.developer_data.stars)
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>GitHub Forks:</Text>
                                <Text style={styles.value}>
                                    {coinData.developer_data.forks
                                        ? formatNumber(coinData.developer_data.forks)
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Commits (4w):</Text>
                                <Text style={styles.value}>
                                    {coinData.developer_data.commit_count_4_weeks || 'N/A'}
                                </Text>
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        padding: 16,
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    imageWrapper: {
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    coinImage: {
        width: 70,
        height: 70,
    },
    basicInfo: {
        marginLeft: 16,
        flex: 1,
    },
    coinName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    coinSymbol: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    rankBadge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    rankText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    priceLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0066cc',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    changeGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    changeItem: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    changeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    changeValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#333',
    },
    readMoreButton: {
        marginTop: 12,
        alignSelf: 'flex-start',
    },
    readMoreText: {
        color: '#0066cc',
        fontWeight: '600',
        fontSize: 14,
    },
    linksContainer: {
        marginTop: 8,
    },
    linkItem: {
        marginBottom: 12,
    },
    linkLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
    },
    linkValue: {
        fontSize: 14,
        color: '#0066cc',
    },
    timeRangeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    timeButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    timeButtonActive: {
        backgroundColor: '#0066cc',
    },
    timeButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    timeButtonTextActive: {
        color: 'white',
    },
    chartPlaceholder: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
    },
    chartLoadingContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
    },
    chartLoadingText: {
        marginTop: 8,
        color: '#666',
    },
});

export default CoinDetails;