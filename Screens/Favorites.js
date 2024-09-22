import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { MoviesContext } from '../Context/MoviesContextProvider';
import { Card, IconButton } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import routes from '../utils/Routes';
import { db } from '../firebaseConfig'; // Import your Firestore instance
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Favorites() {
  const { navigate } = useNavigation();
  const { favorites, dispatch } = useContext(MoviesContext);
  const imgPath = "https://image.tmdb.org/t/p/w500/";

  useEffect(() => {
    // Add favorites to Firestore on component mount
    const addFavoritesToFirestore = async () => {
      for (const movie of favorites) {
        const movieRef = doc(collection(db, 'favorites'), movie.id.toString());
        await addDoc(movieRef, movie);
      }
    };

    if (favorites.length > 0) {
      addFavoritesToFirestore();
    }
  }, [favorites]);

  function handleRemove(id) {
    dispatch({ type: "DeleteFavMovie", payload: { id } });
    const movieRef = doc(db, 'favorites', id.toString());
    deleteDoc(movieRef).catch((error) => console.error("Error removing movie: ", error));
  };

  if (favorites.length === 0) navigate(routes.Home);

  return (
    <ScrollView style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyMessage}>No favorites added yet!</Text>
      ) : (
        favorites.map((movie) => (
          <Card key={movie.id} style={styles.card}>
            <Card.Cover source={{ uri: `${imgPath}${movie.poster_path}` }} style={styles.image} />
            <Card.Content style={styles.cardContent}>
              <Text variant="titleLarge" style={styles.title}>
                {movie.title}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Rating: {movie.vote_average}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Release Date: {movie.release_date}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Popularity: {movie.popularity}
              </Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="basket"
                color="white"
                size={30} 
                style={styles.iconButton}
                onPress={() => handleRemove(movie.id)}
              />
            </Card.Actions>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "black",
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#373A40',
  },
  image: {
    height: 200,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  iconButton: {
    backgroundColor: '#B31312', // Background color of the button
    borderRadius: 20,
  },
});
