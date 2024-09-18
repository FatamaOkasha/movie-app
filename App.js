import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Drawer from './Navigation/Drawer';
import MoviesContextProvider from './Context/MoviesContextProvider';

export default function App() {
  return (
    <MoviesContextProvider>
      <NavigationContainer>
        <Drawer/>
        <StatusBar hidden />
      </NavigationContainer>
    </MoviesContextProvider>
  );
}
