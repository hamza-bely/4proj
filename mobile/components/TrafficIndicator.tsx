import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TrafficIndicator: React.FC = () => {


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trafic en temps réel</Text>
      <View style={styles.indicatorContainer}>
        <Text style={[styles.label, { color: "#16a34a" }]}>Fast</Text>
        <View style={[styles.bar, { backgroundColor: "#4ade80" }]} />
        <View style={[styles.bar, { backgroundColor: "#facc15" }]} />
        <View style={[styles.bar, { backgroundColor: "#f97316" }]} />
        <View style={[styles.bar, { backgroundColor: "#dc2626" }]} />
        <Text style={[styles.label, { color: "#dc2626" }]}>Slow</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  bar: {
    height: 8,
    width: 32,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default TrafficIndicator;
