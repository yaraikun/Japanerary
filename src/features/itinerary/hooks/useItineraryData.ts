import { 
  useState, 
  useEffect, 
  useCallback 
} from 'react';

import { supabase } from '@/lib/supabase';

import { 
  ItineraryDay, 
  ItineraryItem 
} from '../types';

const APP_TITLE = 
  (import.meta as any).env.VITE_APP_TITLE || 'trip';

const PERSISTENCE_KEY = 
  `data_${APP_TITLE.toLowerCase().replace(/\s+/g, '_')}`;

export function useItineraryData() {
  const [data, setData] = useState<ItineraryDay[]>(() => {
    const saved = localStorage.getItem(PERSISTENCE_KEY);
    
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { 
        data: days, 
        error: daysError 
      } = await supabase
        .from('days')
        .select(`
          id,
          date,
          order_index,
          items (*)
        `)
        .order('order_index');

      if (daysError) throw daysError;

      const mappedData: ItineraryDay[] = (days || []).map((day: any) => ({
        id: day.id.toString(),
        date: day.date,
        items: (day.items || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((item: any) => ({
            id: item.id.toString(),
            time: item.time,
            title: item.title,
            short: item.short,
            full: item.full,
            tag: item.tag_text ? {
              text: item.tag_text,
              class: item.tag_class as 'transport' | 'food' | 'activity'
            } : undefined
          }))
      }));

      setData(mappedData);
      
      localStorage.setItem(
        PERSISTENCE_KEY, 
        JSON.stringify(mappedData)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportData = async () => {
    const { data: days } = await supabase
      .from('days')
      .select('*')
      .order('order_index');

    const { data: items } = await supabase
      .from('items')
      .select('*')
      .order('day_id', { ascending: true })
      .order('order_index', { ascending: true });

    const payload = { 
      days, 
      items 
    };

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)], 
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    
    const date = new Date()
      .toISOString()
      .split('T')[0];

    const safeTitle = 
      APP_TITLE.toLowerCase().replace(/\s+/g, '_');

    a.href = url;
    
    a.download = `${safeTitle}_backup_${date}.json`;
    
    a.click();
    
    URL.revokeObjectURL(url);
  };

  const addDay = async (date: string) => {
    const nextOrder = data.length;
    
    const { error } = await supabase
      .from('days')
      .insert({ 
        date, 
        order_index: nextOrder 
      });
      
    if (error) throw error;
    
    await fetchData();
  };

  const updateDay = async (
    id: string, 
    date: string
  ) => {
    const { error } = await supabase
      .from('days')
      .update({ date })
      .eq('id', id);
      
    if (error) throw error;
    
    await fetchData();
  };

  const deleteDay = async (id: string) => {
    const { error } = await supabase
      .from('days')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    await fetchData();
  };

  const addItem = async (
    dayId: string, 
    item: Omit<ItineraryItem, 'id'>
  ) => {
    const day = data.find(d => d.id === dayId);
    
    const nextOrder = day ? day.items.length : 0;
    
    const { error } = await supabase
      .from('items')
      .insert({
        day_id: dayId,
        time: item.time,
        title: item.title,
        short: item.short,
        full: item.full,
        tag_text: item.tag?.text,
        tag_class: item.tag?.class,
        order_index: nextOrder
      });
      
    if (error) throw error;
    
    await fetchData();
  };

  const updateItem = async (
    id: string, 
    item: Omit<ItineraryItem, 'id'>
  ) => {
    const { error } = await supabase
      .from('items')
      .update({
        time: item.time,
        title: item.title,
        short: item.short,
        full: item.full,
        tag_text: item.tag?.text,
        tag_class: item.tag?.class
      })
      .eq('id', id);
      
    if (error) throw error;
    
    await fetchData();
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    await fetchData();
  };

  const deleteItems = async (ids: string[]) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .in('id', ids);
      
    if (error) throw error;
    
    await fetchData();
  };

  const moveItemToDay = async (
    itemId: string, 
    targetDayId: string
  ) => {
    const targetDay = data.find(d => d.id === targetDayId);
    
    const nextOrder = targetDay ? targetDay.items.length : 0;
    
    const { error } = await supabase
      .from('items')
      .update({ 
        day_id: targetDayId,
        order_index: nextOrder 
      })
      .eq('id', itemId);
      
    if (error) throw error;
    
    await fetchData();
  };

  const moveItemsToDay = async (
    itemIds: string[], 
    targetDayId: string
  ) => {
    const targetDay = data.find(d => d.id === targetDayId);
    
    let nextOrder = targetDay ? targetDay.items.length : 0;
    
    const updates = itemIds.map((id) => 
      supabase
        .from('items')
        .update({ 
          day_id: targetDayId, 
          order_index: nextOrder++ 
        })
        .eq('id', id)
    );
    
    const results = await Promise.all(updates);
    
    if (results.some(r => r.error)) {
      throw new Error("Bulk move failed");
    }
    
    await fetchData();
  };

  const reorderItems = async (
    dayId: string, 
    itemIds: string[]
  ) => {
    const originalData = [...data];
    
    const optimisticData = data.map(day => {
      if (day.id === dayId) {
        const items = [...day.items];
        
        const sorted = itemIds.map(
          id => items.find(i => i.id === id)!
        );
        
        return { 
          ...day, 
          items: sorted 
        };
      }
      return day;
    });
    
    setData(optimisticData);
    
    try {
      const updates = itemIds.map((id, index) => 
        supabase
          .from('items')
          .update({ order_index: index })
          .eq('id', id)
      );
      
      const results = await Promise.all(updates);
      
      if (results.some(r => r.error)) {
        throw new Error("Sync Failed");
      }
      
      localStorage.setItem(
        PERSISTENCE_KEY, 
        JSON.stringify(optimisticData)
      );
    } catch (err) {
      setData(originalData);
      
      throw err;
    }
  };

  const swapDays = async (
    dayIdA: string, 
    dayIdB: string
  ) => {
    const originalData = [...data];
    
    const optimisticData = [...data];
    
    const idxA = optimisticData.findIndex(d => d.id === dayIdA);
    
    const idxB = optimisticData.findIndex(d => d.id === dayIdB);
    
    const itemsA = optimisticData[idxA].items;
    
    const itemsB = optimisticData[idxB].items;
    
    optimisticData[idxA] = { 
      ...optimisticData[idxA], 
      items: itemsB 
    };
    
    optimisticData[idxB] = { 
      ...optimisticData[idxB], 
      items: itemsA 
    };
    
    setData(optimisticData);

    try {
      const { error } = await supabase.rpc(
        'swap_day_contents', 
        { 
          id_a: parseInt(dayIdA), 
          id_b: parseInt(dayIdB) 
        }
      );
      
      if (error) throw error;
      
      localStorage.setItem(
        PERSISTENCE_KEY, 
        JSON.stringify(optimisticData)
      );
    } catch (err) {
      setData(originalData);
      
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    isLoading, 
    error, 
    refresh: fetchData, 
    exportData,
    addDay, 
    updateDay, 
    deleteDay,
    addItem,
    updateItem,
    deleteItem,
    deleteItems,
    moveItemToDay,
    moveItemsToDay,
    reorderItems,
    swapDays
  };
}
