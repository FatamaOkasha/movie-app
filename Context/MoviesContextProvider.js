import { StyleSheet, Text, View } from "react-native";
import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MoviesContext = createContext();

const initialState = {
  movies: [],
  loading: true,
  isFavorite: false,
  favorites: [],
  nowPlayingMovies: [],
  TopMovies: [],
  UpcomingMovies: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, movies: action.payload, loading: false };

    case "setLoading":
      return { ...state, loading: action.payload };

    case "setFavorites":
      return { ...state, favorites: action.payload };

    case "TogglingFav":
      const updatedMovies = state.movies.map((movie) =>
        movie.id === action.payload.id
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      );
      const updatedFavorites = updatedMovies.filter(
        (movie) => movie.isFavorite
      );
      const updatedNowPlaying = state.nowPlayingMovies.map((movie) =>
        movie.id === action.payload.id
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      );
      const updatedTopMovies = state.TopMovies.map((movie) =>
        movie.id === action.payload.id
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      );
      const updatedUpcomingMovies = state.UpcomingMovies.map((movie) =>
        movie.id === action.payload.id
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      );

      AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return {
        ...state,
        movies: updatedMovies,
        favorites: updatedFavorites,
        nowPlayingMovies: updatedNowPlaying,
        TopMovies: updatedTopMovies,
        UpcomingMovies: updatedUpcomingMovies,
      };

    case "DeleteFavMovie":
      const favoritesAfterDelete = state.favorites.filter(
        (fav) => fav.id !== action.payload.id
      );
      AsyncStorage.setItem("favorites", JSON.stringify(favoritesAfterDelete));
      return {
        ...state,
        favorites: favoritesAfterDelete,
        movies: state.movies.map((movie) =>
          movie.id === action.payload.id
            ? { ...movie, isFavorite: false }
            : movie
        ),
        nowPlayingMovies: state.nowPlayingMovies.map((movie) =>
          movie.id === action.payload.id
            ? { ...movie, isFavorite: false }
            : movie
        ),
        TopMovies: state.TopMovies.map((movie) =>
          movie.id === action.payload.id
            ? { ...movie, isFavorite: false }
            : movie
        ),
        UpcomingMovies: state.UpcomingMovies.map((movie) =>
          movie.id === action.payload.id
            ? { ...movie, isFavorite: false }
            : movie
        ),
      };

    case "PlayingMovies":
      return { ...state, nowPlayingMovies: action.payload, loading: false };

    case "TopMovies":
      return { ...state, TopMovies: action.payload, loading: false };

    case "UpcomingMovies":
      return { ...state, UpcomingMovies: action.payload, loading: false };

    case "Popular":
      return { ...state, Popular: action.payload, loading: false };

    default:
      throw new Error("Unknown Action");
  }
}

export default function MoviesContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    movies,
    loading,
    isFavorite,
    favorites,
    nowPlayingMovies,
    TopMovies,
    UpcomingMovies,
  } = state;

  useEffect(() => {
    AsyncStorage.getItem("favorites").then((favoritesJSON) => {
      if (favoritesJSON) {
        const favoritesArray = JSON.parse(favoritesJSON);
        dispatch({ type: "setFavorites", payload: favoritesArray });

     
        const updateFavoriteStatus = (movieList) =>
          movieList.map((movie) => ({
            ...movie,
            isFavorite: favoritesArray.some((fav) => fav.id === movie.id),
          }));

        dispatch({
          type: "PlayingMovies",
          payload: updateFavoriteStatus(nowPlayingMovies),
        });

        dispatch({
          type: "TopMovies",
          payload: updateFavoriteStatus(TopMovies),
        });

        dispatch({
          type: "UpcomingMovies",
          payload: updateFavoriteStatus(UpcomingMovies),
        });
      }
    });
  }, []);

  useEffect(() => {
    dispatch({ type: "setLoading", payload: true });
    fetch(
      "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=c17114483fb1dea2caf4f8a59fe2d604"
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data.results });
      })
      .catch((err) => {
        console.error("Error fetching popular movies:", err);
        dispatch({ type: "setLoading", payload: false });
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=c17114483fb1dea2caf4f8a59fe2d604"
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "PlayingMovies", payload: data.results });
      })
      .catch((err) => {
        console.error("Error fetching now playing movies:", err);
        dispatch({ type: "setLoading", payload: false });
      });
  }, [dispatch]);

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/top_rated?api_key=c17114483fb1dea2caf4f8a59fe2d604"
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "TopMovies", payload: data.results });
      })
      .catch((err) => {
        console.error("Error fetching top-rated movies:", err);
        dispatch({ type: "setLoading", payload: false });
      });
  }, [dispatch]);

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?api_key=c17114483fb1dea2caf4f8a59fe2d604"
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "UpcomingMovies", payload: data.results });
      })
      .catch((err) => {
        console.error("Error fetching upcoming movies:", err);
        dispatch({ type: "setLoading", payload: false });
      });
  }, [dispatch]);

  return (
    <MoviesContext.Provider
      value={{
        movies,
        loading,
        isFavorite,
        favorites,
        nowPlayingMovies,
        TopMovies,
        UpcomingMovies,
        dispatch,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

const styles = StyleSheet.create({});
