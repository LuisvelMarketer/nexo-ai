import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { jarvisApi } from '../services/apiService';
import { colors, spacing, borderRadius } from '../theme';
import { Calendar, CheckSquare, Clock, Plus } from 'lucide-react-native';

interface AgendaData {
  events: any[];
  tasks: any[];
  date: string;
}

export function AgendaScreen() {
  const [agenda, setAgenda] = useState<AgendaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow'>('today');

  const loadAgenda = async () => {
    const data = await jarvisApi.getTodayAgenda();
    if (data) {
      setAgenda(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAgenda();
  }, []);

  const renderEvent = (event: any) => (
    <View key={event.id} style={styles.eventCard}>
      <View style={styles.eventTime}>
        <Clock size={16} color={colors.secondary} />
        <Text style={styles.eventTimeText}>
          {new Date(event.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        {event.description && (
          <Text style={styles.eventDescription}>{event.description}</Text>
        )}
      </View>
    </View>
  );

  const renderTask = (task: any) => (
    <View key={task.id} style={styles.taskCard}>
      <View style={styles.taskCheckbox}>
        <CheckSquare size={20} color={colors.success} />
      </View>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>{task.title}</Text>
      </View>
      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
        <Text style={styles.priorityText}>{task.priority}</Text>
      </View>
    </View>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.accent + '20';
      case 'medium': return colors.warning + '20';
      case 'low': return colors.success + '20';
      default: return colors.surface;
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.tabActive]}
          onPress={() => setActiveTab('today')}
        >
          <Calendar size={16} color={activeTab === 'today' ? colors.text : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>Hoy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tomorrow' && styles.tabActive]}
          onPress={() => setActiveTab('tomorrow')}
        >
          <Text style={[styles.tabText, activeTab === 'tomorrow' && styles.tabTextActive]}>Mañana</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Calendar size={16} color={colors.secondary} /> Eventos
        </Text>
        {agenda?.events && agenda.events.length > 0 ? (
          agenda.events.map(renderEvent)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Sin eventos</Text>
            <Text style={styles.emptyHint}>Di "Tengo reunión mañana a las 9"</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <CheckSquare size={16} color={colors.secondary} /> Tareas
        </Text>
        {agenda?.tasks && agenda.tasks.length > 0 ? (
          agenda.tasks.map(renderTask)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Sin tareas</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  tabTextActive: {
    color: colors.text,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eventTimeText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  eventDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCheckbox: {
    marginRight: spacing.md,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 14,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyHint: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  loading: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
});