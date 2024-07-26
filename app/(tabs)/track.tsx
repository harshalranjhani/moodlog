import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Image,
  View,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Card, Button, useTheme, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width, height } = Dimensions.get("window");

import { AppState } from "react-native";
import BottomSheet from "@/components/BottomSheet";
import { useDispatch } from "react-redux";
import moodSlice, { setMood } from "@/utils/mood-slice";

const TrackScreen: React.FC = () => {
  const { colors } = useTheme();
  const [currentMood, setCurrentMood] = useState({
    icon: "happy-outline",
    mood: "Happy",
    subtitle: "Always keep a smile on your face!",
  });
  const dispatch = useDispatch();
  const animatedValue = new Animated.Value(0);
  const ws = useRef<WebSocket | null>(null);
  const appState = useRef(AppState.currentState);

  const connectWebSocket = () => {
    ws.current = new WebSocket("wss://moodlog-backend.onrender.com");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        setCurrentMood({
          mood: data.mood,
          icon: data.icon,
          subtitle: data.subtitle,
        });
        dispatch(
          setMood({
            mood: {
              mood: data.mood,
              icon: data.icon,
              subtitle: data.subtitle,
            },
          })
        );
        startAnimation();
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        connectWebSocket();
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log("App has gone to the background!");
        if (ws.current) {
          ws.current.close();
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Image
            source={require("@/assets/images/track-header.webp")}
            style={styles.moodlogLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Track your mood!</ThemedText>
        </ThemedView>
        <View style={styles.content}>
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <Animated.View style={[animatedStyle]}>
                <Ionicons
                  name={currentMood?.icon as any}
                  size={80}
                  color={colors.primary}
                />
              </Animated.View>
              <Text style={styles.cardTitle}>{currentMood?.mood}</Text>
              <Text style={styles.cardText}>{currentMood?.subtitle}</Text>
            </Card.Content>
          </Card>
        </View>
      </ParallaxScrollView>
      <BottomSheet draggableRange={{ top: height * 0.9, bottom: 0 }} />
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  moodlogLogo: {
    height: 250,
    width: 400,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  cardSubtitle: {
    fontSize: 18,
    color: "gray",
    marginBottom: 8,
  },
  cardText: {
    textAlign: "center",
    paddingHorizontal: 16,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default TrackScreen;
