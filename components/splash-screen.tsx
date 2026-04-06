import { useCampus } from "@/contexts/campus-context";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function SplashScreen() {
  const { colors, isDark } = useTheme();
  const { isLoading: languageLoading } = useLanguage();
  const { isLoading: campusLoading } = useCampus();
  const [showContent, setShowContent] = useState(false);

  const isLoading = languageLoading || campusLoading;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Kyung Hee University
        </Text>
        <Text style={[styles.subtitle, { color: colors.primary }]}>
          Shuttle Bus System
        </Text>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={colors.primary}
            style={styles.spinner}
          />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 32,
  },
  spinner: {
    transform: [{ scale: 1.2 }],
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.7,
  },
});
