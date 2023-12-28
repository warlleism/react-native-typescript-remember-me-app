import React from 'react';
import { ScrollView, StyleSheet, useColorScheme, Text, View, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FormScreen from './src/screens/form-screen';

const { width, height } = Dimensions.get('window');


export default function App() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#464646' : '#f2f2f2';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="dark" />
      <ScrollView>
        <FormScreen />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    height: height
  },
});
