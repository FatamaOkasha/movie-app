import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from '../Screens/Home';
import routes from '../utils/Routes';
import Movies from '../Screens/Movies';

import Favorites from '../Screens/Favorites';

const drawer = createDrawerNavigator();
export default function Drawer() {
  return (
    <drawer.Navigator 
     screenOptions={{       
        
          headerStyle: { backgroundColor: "#373A40" },
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 30 },
               
      }} >
    <drawer.Screen name={routes.Home} component={Home}  />
   
    {/* <drawer.Screen name={routes.Movies} component={Movies} /> */}
  
    <drawer.Screen name={routes.Favorites} component={Favorites} />
  </drawer.Navigator>
  )
}

const styles = StyleSheet.create({})