import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Previous() {
  const pathname = usePathname();
  const router = useRouter();
  const backPath = pathname.includes('gw') ? "/gw" : pathname.includes('se') ? "/se" : "/gl";
  
  return (
    <View style={styles.navContainer}>
      <View style={styles.navInner}>
        <Pressable onPress={() => router.push(backPath as any)}>
          <Text style={styles.navLink}>← Back to {backPath}</Text>
        </Pressable>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  // Link
  navContainer: { marginTop: 32, gap: 16 },
  navInner: { marginTop: 16 },
  navLink: { color: '#4b5563', textDecorationLine: 'underline' }
});
