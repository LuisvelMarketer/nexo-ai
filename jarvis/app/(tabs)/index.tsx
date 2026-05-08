import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useJarvis } from '../../src/store/JarvisContext';
import { colors, spacing, borderRadius } from '../../src/theme';
import { Mic, MicOff, Waves, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { isListening, isAwake, isSpeaking, activateJarvis, messages, wakeWord } = useJarvis();
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isListening || isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, isSpeaking]);

  const handleActivate = () => {
    activateJarvis();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logo, { transform: [{ scale: pulseAnim }] }]}>
            <Zap size={40} color={colors.secondary} />
          </Animated.View>
        </View>
        <Text style={styles.title}>NEXO</Text>
        <Text style={styles.subtitle}>JARVIS en tu bolsillo</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: isAwake ? colors.success : colors.textSecondary }]} />
          <Text style={styles.statusText}>{isAwake ? 'Activo' : 'En espera'}</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Wake Word:</Text>
          <Text style={styles.wakeWord}>{wakeWord}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.activateButton, isListening && styles.activateButtonListening]}
        onPress={handleActivate}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          {isListening ? (
            <MicOff size={50} color={colors.accent} />
          ) : (
            <Mic size={50} color={colors.text} />
          )}
        </Animated.View>
        <Text style={styles.activateText}>
          {isListening ? 'Escuchando...' : 'Toca para activar NEXO'}
        </Text>
      </TouchableOpacity>

      {messages.length > 0 && (
        <View style={styles.lastMessageContainer}>
          <Text style={styles.lastMessageLabel}>Último mensaje:</Text>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {messages[messages.length - 1]?.content}
          </Text>
        </View>
      )}

      <View style={styles.waveContainer}>
        {isListening && (
          <>
            <Waves size={24} color={colors.secondary} style={styles.wave} />
            <Waves size={20} color={colors.primary} style={styles.wave} />
            <Waves size={16} color={colors.accent} style={styles.wave} />
          </>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Di "Hey NEXO" para activarme
        </Text>
        <Text style={styles.infoSubtext}>
          Próximamente: detección de voz continua
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  statusText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  wakeWord: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  activateButton: {
    width: width - spacing.lg * 2,
    height: 200,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  activateButtonListening: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
  },
  activateText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  lastMessageContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  lastMessageLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    color: colors.text,
    fontSize: 14,
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: spacing.lg,
  },
  wave: {
    marginHorizontal: spacing.xs,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: spacing.xl,
  },
  infoText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  infoSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});