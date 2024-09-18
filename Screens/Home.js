import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import routes from '../utils/Routes';
import Movies from './Movies';


export default function Home() {

  return (
    <View >
      <Movies/>
    </View>
  );
}

