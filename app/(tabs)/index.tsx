import React from 'react';
import { Image, StyleSheet, Platform, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native'; // Assuming you're using React Navigation

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: colors.background, light: colors.background }}
      headerImage={
        <Image
          source={require('@/assets/images/moodlog-logo.webp')}
          style={styles.moodlogLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <View style={styles.cardsContainer}>
        <FeatureCard 
          icon="insert-emoticon" 
          title="Mood Tracking" 
          subtitle="Track your mood daily and get insights." 
          colors={colors}
        />
        <FeatureCard 
          icon="timeline" 
          title="Mood Analysis" 
          subtitle="Analyze your mood patterns over time." 
          colors={colors}
        />
      </View>
    </ParallaxScrollView>
  );
};

type FeatureCardProps = {
  icon: string;
  title: string;
  subtitle: string;
  colors: any;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, subtitle, colors }) => {
  return (
    <ThemedView style={[styles.card, { backgroundColor: colors.card }]}>
      <MaterialIcons name={icon as any} size={48} style={[styles.cardIcon, { color: colors.primary }]} />
      <ThemedText type="subtitle" style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardsContainer: {
    flexDirection: 'column',
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  moodlogLogo: {
    height: 250,
    width: 400,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

export default HomeScreen;
