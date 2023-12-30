import React from 'react';
import { useColorScheme, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import FormScreen from './src/screens/form-screen';

const { width, height } = Dimensions.get('window');


export default function App() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#464646' : '#f2f2f2';

  return (
    <SafeAreaView style={{ backgroundColor: "#f2f2f2", height: height, }}>
      <StatusBar />
      <FormScreen />
    </SafeAreaView>
  );
}

