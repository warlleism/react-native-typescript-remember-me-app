import React from 'react';
import { useColorScheme, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import FormScreen from './src/screens/form-screen';

const { height } = Dimensions.get('window');

export default function App() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1f1f1f' : '#6200ff';

  return (
    <SafeAreaView style={{ backgroundColor: "#f2f2f2", height: height, }}>
      <StatusBar backgroundColor={backgroundColor} />
      <FormScreen />
    </SafeAreaView>
  );
}

