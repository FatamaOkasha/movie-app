import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, TextInput } from "react-native";
import { Card, Text, ActivityIndicator, IconButton } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import { MoviesContext } from "../Context/MoviesContextProvider";
import { db } from '../firebaseConfig'; // Import your Firestore instance
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Movies() {
  const {
    movies,
    loading,
    favorites,
    nowPlayingMovies,
    TopMovies,
    UpcomingMovies,
    dispatch,
  } = useContext(MoviesContext);
  
  const [text, setText] = useState("");
  const [searchMovies, setSearchMovies] = useState(movies);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  const imgPath = "https://image.tmdb.org/t/p/w500/";

  useEffect(() => {
    setSearchMovies(movies);
  }, [movies]);

  useEffect(() => {
    handleFilter(selectedFilter);
  }, [movies, selectedFilter]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#3ABEF9" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  function handleSearch(val) {
    setText(val);
    const MoviesForSearch = selectedFilter ? filteredMovies : movies;
    if (val.trim() === "") {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        MoviesForSearch.filter((movie) =>
          movie.title.toLowerCase().includes(val.toLowerCase())
        )
      );
    }
  }

  function handleFilter(value) {
    setSelectedFilter(value);
    let filteredList = [];
    switch (value) {
      case "Now Playing Movies":
        filteredList = nowPlayingMovies;
        break;
      case "Top Movies":
        filteredList = TopMovies;
        break;
      case "Upcoming Movies":
        filteredList = UpcomingMovies;
        break;
      case "Popular":
        filteredList = movies;
        break;
      default:
        filteredList = movies;
    }

    setFilteredMovies(
      filteredList.map((movie) => ({
        ...movie,
        isFavorite: favorites.some((fav) => fav.id === movie.id),
      }))
    );
  }

  const handleFavoriteToggle = async (movie) => {
    const isFavorite = favorites.some((fav) => fav.id === movie.id);
    if (isFavorite) {
      // Remove from favorites
      dispatch({ type: "DeleteFavMovie", payload: { id: movie.id } });
      const movieRef = doc(db, 'favorites', movie.id.toString());
      await deleteDoc(movieRef).catch((error) => console.error("Error removing favorite: ", error));
    } else {
      // Add to favorites
      dispatch({ type: "AddFavMovie", payload: { movie } });
      const movieRef = doc(collection(db, 'favorites'), movie.id.toString());
      await addDoc(movieRef, movie).catch((error) => console.error("Error adding favorite: ", error));
    }
    handleFilter(selectedFilter);
  };

  const moviesToRender = selectedFilter ? filteredMovies : searchMovies;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchFilterContainer}>
        <TextInput
          value={text}
          onChangeText={(val) => handleSearch(val)}
          placeholder="Search"
          placeholderTextColor="white"
          style={styles.searchInput}
        />
        <RNPickerSelect
          items={[
            { label: "Popular", value: "Popular" },
            { label: "Top Movies", value: "Top Movies" },
            { label: "Upcoming Movies", value: "Upcoming Movies" },
            { label: "Now Playing Movies", value: "Now Playing Movies" },
          ]}
          onValueChange={(val) => handleFilter(val)}
          value={selectedFilter}
          style={pickerSelectStyles}
        />
      </View>

      {moviesToRender.map((movie) => (
        <Card key={movie.id} style={styles.card}>
          <Card.Cover
            source={{ uri: `${imgPath}${movie.poster_path}` }}
            style={styles.image}
          />
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={styles.title}>
              {movie.title}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Rating: {movie.vote_average}
            </Text>
          </Card.Content>
          <Card.Actions>
            <IconButton
              style={styles.iconButton}
              icon={movie.isFavorite ? "heart" : "heart-outline"}
              color={movie.isFavorite ? "red" : "white"}
              onPress={() => handleFavoriteToggle(movie)}
              size={30}
            />
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "black",
  },
  searchFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  searchInput: {
    borderColor: "gray",
    borderWidth: 2,
    padding: 10,
    borderRadius: 20,
    color: "white",
    flex: 1,
    marginRight: 10,
  },
  card: {
    marginBottom: 25,
    borderRadius: 8,
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#373A40",
  },
  image: {
    width: "100%",
    height: 300,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  iconButton: {
    backgroundColor: "#B31312",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#3ABEF9",
  },
});

const pickerSelectStyles = {
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    color: "white",
    backgroundColor: "#373A40",
    paddingRight: 30,
  },
  placeholder: {
    color: "white",
  },
};
