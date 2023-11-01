import Header from '@/components/Header';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
