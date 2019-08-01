import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DraggableBottomSheet from '../src/DraggableBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  handle: {
    backgroundColor: 'grey',
    width: 40,
    height: 4,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>

      <DraggableBottomSheet>
        {Handle => (
          <View style={styles.card}>
            <Handle><View style={styles.handle} /></Handle>
            <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius sodales lectus placerat pulvinar. Donec laoreet metus vel aliquam euismod. Fusce nisi sem, venenatis non tortor nec, maximus facilisis quam. Integer semper sem metus, eu aliquam magna congue eu. Aliquam erat volutpat. Nulla feugiat eros libero, vel mattis diam ornare ut. Sed accumsan vel lorem ut efficitur. Aenean id velit et felis tincidunt convallis sed nec lectus. Nullam congue justo sed rhoncus malesuada. In venenatis odio at ligula vulputate, ac varius leo consectetur. Proin elementum mauris euismod, auctor erat et, posuere lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam hendrerit turpis magna, sed tincidunt ante tincidunt sed.
            </Text>
          </View>
        )}

      </DraggableBottomSheet>
    </View>
  );
}
