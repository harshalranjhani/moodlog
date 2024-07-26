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
import { useSelector } from "react-redux";
import SlidingUpPanel from "rn-sliding-up-panel";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 20,
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

const dummyData = Array.from({ length: 10 }).map((_, i) => ({
  id: i.toString(),
  text: `Item ${i + 1}`,
}));

const BottomSheet = ({ draggableRange }: BottomSheetProps) => {
  const _draggedValue = useRef(new Animated.Value(0)).current;
  const _panelRef = useRef<SlidingUpPanel | null>(null);
  const { colors } = useTheme();
  const [suggestion, setSuggestion] = useState("" as string);
  const [loading, setLoading] = useState(true);
  const mood = useSelector((state: any) => state.mood.mood);

  const fetchSuggestions = async (mood: string) => {
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
      console.log(response.data);
      setSuggestion(response.data.suggestions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suggestions", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions(mood.mood + mood.subtitle);
  }, []);

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

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleSlideUp}>
        <Text style={styles.buttonText}>View AI powered analytics</Text>
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
            _panelRef.current.hide(); // Reset the panel to initial state to ensure it shows up on next click
          }
        }}
      >
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Animated.View
              style={{
                transform: [
                  { translateY: textTranslateY },
                  { translateX: textTranslateX },
                  { scale: textScale },
                ],
              }}
            >
              <Text style={styles.textHeader}>AI Powered Analytics</Text>
            </Animated.View>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            {loading ? (
              <ActivityIndicator size="large" color="#6200ee" />
            ) : (
              <Text style={{ color: "white" }}>{suggestion}</Text>
            )}
          </ScrollView>
        </View>
      </SlidingUpPanel>
    </View>
  );
};

export default BottomSheet;
