import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { MoviesContext } from '../Context/MoviesContextProvider';
import { Card, IconButton } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import routes from '../utils/Routes';

export default function Favorites() {
  const {navigate}=useNavigation();

  const { favorites, dispatch } = useContext(MoviesContext);
  const imgPath = "https://image.tmdb.org/t/p/w500/";

  function handleRemove(id){
    
    dispatch({ type: "DeleteFavMovie", payload: {id} });
    
  };
  if (favorites.length===0) navigate(routes.Home);

     

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
//styles
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
