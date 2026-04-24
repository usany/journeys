import { usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useBusData } from "../hooks/useBusData";

export default function RefreshCounter() {
  const pathname = usePathname();
  const { busData, timeUntilNextFetch, fetchBusData } = useBusData(pathname);
  console.log(timeUntilNextFetch)
  return (
    <View style={styles.refreshContainer}>
      <Text style={styles.refreshText}>
        Next data update in: <Text style={styles.refreshCounter}>{timeUntilNextFetch}s</Text>
      </Text>
      <Pressable
        onPress={fetchBusData}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>Refresh Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  refreshContainer: { alignItems: 'center', marginBottom: 16 },
  refreshText: { fontSize: 14, color: '#4b5563', marginBottom: 8 },
  refreshCounter: { fontWeight: 600, color: '#2563eb' },
  refreshButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#2563eb', borderRadius: 8, fontSize: 14 },
  refreshButtonText: { color: 'white' }
});
