import React, { useState } from 'react';
import { StyleSheet, Image, View, Animated, Easing, Dimensions } from 'react-native';
import { Card, Button, useTheme, Text } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width, height } = Dimensions.get('window');

const moods = [
  { title: 'Current Mood', subtitle: 'Feeling Happy', icon: 'happy-outline', description: 'You have been feeling happy lately. Keep up the positive vibes!' },
  { title: 'Current Mood', subtitle: 'Feeling Sad', icon: 'sad-outline', description: 'You have been feeling sad lately. It’s okay to have bad days.' },
  { title: 'Current Mood', subtitle: 'Feeling Excited', icon: 'rocket-outline', description: 'You are excited about something. Enjoy the moment!' },
  { title: 'Current Mood', subtitle: 'Feeling Angry', icon: 'alert-outline', description: 'You have been feeling angry. Try to find a way to cool down.' },
  { title: 'Current Mood', subtitle: 'Feeling Anxious', icon: 'warning-outline', description: 'You have been feeling anxious. Take deep breaths and try to relax.' },
  { title: 'Current Mood', subtitle: 'Feeling Calm', icon: 'leaf-outline', description: 'You are feeling calm. Keep maintaining your peace.' },
];

const TrackScreen: React.FC = () => {
  const { colors } = useTheme();
  const [currentMood, setCurrentMood] = useState(moods[0]);
  const animatedValue = new Animated.Value(0);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchRandomMood = () => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setCurrentMood(randomMood);
    startAnimation();
  };

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/track-header.webp')}
          style={styles.moodlogLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Track your mood!</ThemedText>
      </ThemedView>
      <View style={styles.content}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <Animated.View style={[animatedStyle]}>
              <Ionicons name={currentMood.icon as any} size={80} color={colors.primary} />
            </Animated.View>
            <Text style={styles.cardTitle}>{currentMood.title}</Text>
            <Text style={styles.cardSubtitle}>{currentMood.subtitle}</Text>
            <Text style={styles.cardText}>{currentMood.description}</Text>
          </Card.Content>
        </Card>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={fetchRandomMood} style={styles.button}>
            View AI Powered Analytics
          </Button>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  moodlogLogo: {
    height: 250,
    width: 400,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  cardSubtitle: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 8,
  },
  cardText: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default TrackScreen;
