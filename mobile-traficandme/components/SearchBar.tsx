import { TextInput, FlatList, TouchableOpacity, Text, View } from 'react-native';

export default function SearchBar({ value, onChangeText, suggestions, onSelect }) {
  return (
    <View>
      <TextInput
        placeholder="Où va-t-on ?"
        value={value}
        onChangeText={onChangeText}
        style={{ backgroundColor: '#eee', padding: 10, borderRadius: 8 }}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Text>{item.address.freeformAddress}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
