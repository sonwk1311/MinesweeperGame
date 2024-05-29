// App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import GameScreen from './src/screens/GameScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <GameScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
