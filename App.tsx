import React from 'react';
import { useColorScheme, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import FormScreen from './src/screens/form-screen';
import { RenderData } from './src/screens/render-data';
import { ContentProvider } from './src/context/formContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { height } = Dimensions.get('window');

export default function App() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1f1f1f' : '#6200ff';

  const Stack = createNativeStackNavigator();

  function HomeScreen() {
    return (
      <FormScreen />
    );
  }

  function RenderDataScreen() {
    return (
      <RenderData />
    )
  }

  return (
    <NavigationContainer>
      <ContentProvider>
        <SafeAreaView style={{ backgroundColor: "#f2f2f2", height: height }}>
          <StatusBar backgroundColor={backgroundColor} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AllData" component={RenderDataScreen} />
          </Stack.Navigator>
        </SafeAreaView>
      </ContentProvider>
    </NavigationContainer>
  );
}
