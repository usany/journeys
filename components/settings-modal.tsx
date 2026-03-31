import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { theme, toggleTheme, isDark, colors } = useTheme();
  const { language, toggleLanguage, text } = useLanguage();

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{text('settings.title')}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{text('settings.appearance')}</Text>
            
            <Pressable
              style={({ pressed }) => [
                styles.settingItem,
                { backgroundColor: pressed ? colors.border : 'transparent' }
              ]}
              onPress={handleThemeToggle}
            >
              <View style={styles.settingLeft}>
                <Ionicons 
                  name={isDark ? 'moon' : 'sunny'} 
                  size={20} 
                  color={colors.text} 
                  style={styles.settingIcon}
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {text('settings.theme')}
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: colors.text }]}>
                  {isDark ? text('theme.dark') : text('theme.light')}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text} />
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.settingItem,
                { backgroundColor: pressed ? colors.border : 'transparent' }
              ]}
              onPress={handleLanguageToggle}
            >
              <View style={styles.settingLeft}>
                <Ionicons 
                  name="language" 
                  size={20} 
                  color={colors.text} 
                  style={styles.settingIcon}
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {text('settings.language')}
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: colors.text }]}>
                  {language === 'ko' ? text('language.korean') : text('language.english')}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text} />
              </View>
            </Pressable>
          </View>

          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{text('settings.about')}</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="information-circle" size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {text('settings.version')}
                </Text>
              </View>
              <Text style={[styles.settingValue, { color: colors.text }]}>
                1.0.0
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    marginRight: 8,
  },
});
