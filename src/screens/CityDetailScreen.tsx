import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, List, ListIconProps, CardContent, ListSection, ListItem, ListIcon } from 'react-native-paper';
import { calculateOverallAqi } from '../services/AqiCalculator';
import { CityData, RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type CityDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CityDetail'>;

const CityDetailScreen: React.FC<CityDetailScreenProps> = ({ route }: CityDetailScreenProps) => {
  const { city } = route.params;
  const airQualityData = city.sampleData[0];
  const aqiData = calculateOverallAqi(airQualityData?.components || {});

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getHealthRecommendation = (aqi: number) => {
    if (aqi <= 50) return 'Air quality is satisfactory, and air pollution poses little or no risk.';
    if (aqi <= 100) return 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
    if (aqi <= 150) return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    if (aqi <= 200) return 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
    if (aqi <= 300) return 'Health alert: The risk of health effects is increased for everyone.';
    return 'Health warning of emergency conditions: everyone is more likely to be affected.';
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Title style={styles.title}>{city.name}</Title>
          <View style={styles.aqiContainer}>
            <Title style={[styles.aqiValue, { color: getAQIColor(aqiData.aqi) }]}>
              {aqiData.aqi.toFixed(0)}
            </Title>
            <Paragraph style={styles.aqiStatus}>{getAQIStatus(aqiData.aqi)}</Paragraph>
          </View>
          <Paragraph style={styles.recommendation}>
            {getHealthRecommendation(aqiData.aqi)}
          </Paragraph>
        </CardContent>
      </Card>

      <Card style={styles.card}>
        <CardContent>
          <Title>Pollutants</Title>
          <ListSection>
            {Object.entries(airQualityData?.components || {}).map(([key, value]) => {
              const numericValue = Number(value);
              return (
                <ListItem
                  key={key}
                  title={formatPollutantName(key)}
                  description={`${numericValue.toFixed(2)} µg/m³`}
                  left={props => <ListIcon {...props} icon="alert-circle" />}
                />
              );
            })}
          </ListSection>
        </CardContent>
      </Card>

      {airQualityData?.weather && (
        <Card style={styles.card}>
          <CardContent>
            <Title>Weather</Title>
            <ListSection>
              <ListItem
                title="Temperature"
                description={`${Math.round(airQualityData.weather.temp)}°C`}
                left={props => <ListIcon {...props} icon="thermometer" />}
              />
              <ListItem
                title="Feels Like"
                description={`${Math.round(airQualityData.weather.feels_like)}°C`}
                left={props => <ListIcon {...props} icon="thermometer-lines" />}
              />
              <ListItem
                title="Humidity"
                description={`${airQualityData.weather.humidity}%`}
                left={props => <ListIcon {...props} icon="water" />}
              />
              <ListItem
                title="Wind Speed"
                description={`${airQualityData.weather.wind_speed} m/s`}
                left={props => <ListIcon {...props} icon="weather-windy" />}
              />
            </ListSection>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
};

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#00ff00';      // Good
  if (aqi <= 100) return '#ffff00';     // Moderate
  if (aqi <= 150) return '#ff9900';     // Unhealthy for Sensitive Groups
  if (aqi <= 200) return '#ff0000';     // Unhealthy
  if (aqi <= 300) return '#990099';     // Very Unhealthy
  return '#660066';                      // Hazardous
};

const formatPollutantName = (name: string) => {
  const names: Record<string, string> = {
    co: 'Carbon Monoxide',
    no: 'Nitric Oxide',
    no2: 'Nitrogen Dioxide',
    o3: 'Ozone',
    so2: 'Sulfur Dioxide',
    pm2_5: 'PM2.5',
    pm10: 'PM10',
    nh3: 'Ammonia',
  };
  return names[name] || name;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  aqiContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  aqiValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  aqiStatus: {
    fontSize: 18,
    marginTop: 5,
  },
  recommendation: {
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default CityDetailScreen; 