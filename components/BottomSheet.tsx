import axios from "axios";
import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  Animated,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import SlidingUpPanel from "rn-sliding-up-panel";
import Markdown from "react-native-markdown-display";
import { setSuggestion } from "@/utils/mood-slice";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  buttonContainer: {
    marginTop: 20,
  },
  mdContent: {
    color: "white"
  },
  button: {
    backgroundColor: "#6200ee",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  panel: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    position: "relative",
  },
  panelHeader: {
    height: 100,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
  },
  textHeader: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  content: {
    padding: 24,
  },
  itemContainer: {
    backgroundColor: "#2e2e2e",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  itemText: {
    fontSize: 18,
    color: "#FFF",
  },
});

interface BottomSheetProps {
  draggableRange: {
    top: number;
    bottom: number;
  };
}

const BottomSheet = ({ draggableRange }: BottomSheetProps) => {
  const _draggedValue = useRef(new Animated.Value(0)).current;
  const _panelRef = useRef<SlidingUpPanel | null>(null);
  const { colors } = useTheme();
  const [localSuggestion, setLocalSuggestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const mood = useSelector((state: any) => state.mood.mood);
  const suggestion = useSelector((state: any) => state.mood.suggestion);
  const dispatch = useDispatch();

  const fetchSuggestions = async (mood: string) => {
    setLoading(true);
    try {
      console.log("fetching suggestions");
      const response = await axios.post(
        "https://moodlog-backend.onrender.com/data/suggestions",
        { mood },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const suggestionText = response?.data?.suggestionResponse?.suggestionText || "";
      setLocalSuggestion(suggestionText);
      dispatch(setSuggestion(suggestionText));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suggestions", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions(mood.mood + mood.subtitle);
  }, [mood]);

  const { top, bottom } = draggableRange;

  const backgroundOpacity = _draggedValue.interpolate({
    inputRange: [height - 48, height],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const textTranslateY = _draggedValue.interpolate({
    inputRange: [bottom, top],
    outputRange: [0, 8],
    extrapolate: "clamp",
  });

  const textTranslateX = _draggedValue.interpolate({
    inputRange: [bottom, top],
    outputRange: [0, -112],
    extrapolate: "clamp",
  });

  const textScale = _draggedValue.interpolate({
    inputRange: [bottom, top],
    outputRange: [1, 0.7],
    extrapolate: "clamp",
  });

  const handleSlideUp = useCallback(() => {
    if (_panelRef.current) {
      _panelRef.current.show();
    }
  }, []);

  // Animation for the button text color
  const colorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnimation]);

  const buttonTextColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFF", "#FF69B4"], // White to HotPink color transition
  });

  const headerColorAnimation = _draggedValue.interpolate({
    inputRange: [bottom, top],
    outputRange: ["#FFF", "#FF69B4"], // White to HotPink color transition
  });

  const headerFontSize = _draggedValue.interpolate({
    inputRange: [bottom, top],
    outputRange: [24, 32], // Increase font size
    extrapolate: "clamp",
  });

  const headerStyle = {
    color: headerColorAnimation,
    fontSize: headerFontSize,
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSlideUp}>
        <Animated.Text style={[styles.buttonText, { color: buttonTextColor }]}>
          View AI powered suggestions
        </Animated.Text>
      </TouchableOpacity>
      <SlidingUpPanel
        ref={_panelRef}
        draggableRange={draggableRange}
        animatedValue={_draggedValue}
        snappingPoints={[top * 0.9]}
        showBackdrop={true}
        backdropOpacity={0.3}
        height={height * 0.9}
        friction={1}
        onBottomReached={() => {
          if (_panelRef.current) {
            _panelRef.current.hide();
          }
        }}
      >
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Animated.Text style={[styles.textHeader, headerStyle]}>
              AI Powered Analytics
            </Animated.Text>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            {loading ? (
              <ActivityIndicator size="large" color="#6200ee" />
            ) : (
              <Markdown style={{ body: { color: "white" } }}>
                {suggestion || "No suggestions available."}
              </Markdown>
            )}
          </ScrollView>
        </View>
      </SlidingUpPanel>
    </View>
  );
};

export default BottomSheet;
