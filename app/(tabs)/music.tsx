import { setMusicRecs } from '@/utils/music-slice';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

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
}

const Music: React.FC = () => {
  const musicData = useSelector((state: any) => state.music.musicData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mood = useSelector((state: any) => state.mood.mood);
  const dispatch = useDispatch();

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
      console.log("Music data", musicData)
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch music data');
      setLoading(false);
    }
  };

  const renderMusicCard = ({ item }: { item: Track }) => (
    // Log item to inspect structure
    console.log('Track item:', item),
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Avatar.Image size={50} source={{ uri: item.album.images[0].url }} />
        <View style={styles.textContainer}>
          <Text style={styles.songName}>{item.name}</Text>
          <Text style={styles.artistName}>{item.artists.map(artist => artist.name).join(', ')}</Text>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Recommendations</Text>
      <FlatList
        data={musicData}
        renderItem={renderMusicCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
    color: 'gray',
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
    color: 'red',
    fontSize: 18,
  },
});

export default Music;
