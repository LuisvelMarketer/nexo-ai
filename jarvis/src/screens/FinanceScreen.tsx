import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useJarvis } from '../store/JarvisContext';
import { jarvisApi } from '../services/apiService';
import { colors, spacing, borderRadius } from '../theme';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react-native';

interface DashboardData {
  balance: number;
  month_expenses: number;
  month_income: number;
  upcoming_events?: any[];
  pending_tasks?: any[];
}

export function FinanceScreen() {
  const { speak } = useJarvis();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const dashboard = await jarvisApi.getDashboard();
    if (dashboard) {
      setData(dashboard);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSpeakBalance = () => {
    if (data) {
      speak(`Tu balance es de ${data.balance} dólares este mes.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.secondary} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Finanzas</Text>
        <Text style={styles.subtitle}>Resumen del mes</Text>
      </View>

      <TouchableOpacity style={styles.balanceCard} onPress={handleSpeakBalance} activeOpacity={0.8}>
        <Wallet size={24} color={colors.secondary} />
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={[styles.balanceValue, { color: (data?.balance || 0) >= 0 ? colors.success : colors.accent }]}>
            ${(data?.balance || 0).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <TrendingUp size={20} color={colors.success} />
          <Text style={styles.statLabel}>Ingresos</Text>
          <Text style={styles.statValue}>${(data?.month_income || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingDown size={20} color={colors.accent} />
          <Text style={styles.statLabel}>Gastos</Text>
          <Text style={styles.statValue}>${(data?.month_expenses || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <PiggyBank size={20} color={colors.warning} />
          <Text style={styles.statLabel}>Ahorro</Text>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            ${((data?.month_income || 0) - (data?.month_expenses || 0)).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen rápido</Text>
        <View style={styles.quickSummary}>
          <Text style={styles.quickText}>
            Este mes ganaste ${data?.month_income.toFixed(2) || '0.00'} y gastaste ${data?.month_expenses.toFixed(2) || '0.00'}.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  loading: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  balanceContent: {
    marginLeft: spacing.md,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  statValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  quickSummary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  quickText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
});