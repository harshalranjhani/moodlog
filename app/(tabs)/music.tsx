import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { Avatar, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import * as Haptics from 'expo-haptics';
import { setMusicRecs } from '@/utils/music-slice';

interface Artist {
  name: string;
}

interface Album {
  images: { url: string }[];
}

interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  external_urls: {spotify : string}; 
}

const Music: React.FC = () => {
  const musicData = useSelector((state: any) => state.music.musicData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mood = useSelector((state: any) => state.mood.mood);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    fetchMusicData();
  }, [mood]);

  const fetchMusicData = async () => {
    try {
      const response = await fetch('https://moodlog-backend.onrender.com/data/recs', {
        method: "POST",
        body: JSON.stringify({ mood: mood.mood, subtitle: mood.subtitle }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      dispatch(setMusicRecs({ musicData: data.recs.tracks }));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch music data');
      setLoading(false);
    }
  };

  const renderMusicCard = ({ item }: { item: Track }) => (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(item.external_urls.spotify);
        Haptics.selectionAsync();
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }}
    >
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Avatar.Image size={50} source={{ uri: item.album.images[0].url }} />
          <View style={styles.textContainer}>
            <ThemedText style={styles.songName}>{item.name}</ThemedText>
            <ThemedText style={styles.artistName}>{item.artists.map(artist => artist.name).join(', ')}</ThemedText>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>{error}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedText style={styles.title}>Music Recommendations</ThemedText>
        <FlatList
          data={musicData}
          renderItem={renderMusicCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: -100,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  songName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
});

export default Music;
