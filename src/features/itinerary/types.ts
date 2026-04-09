export interface ItineraryItem {
  id: string;
  time?: string;
  title: string;
  short: string;
  full?: string;
  tag?: {
    text: string;
    class: 'transport' | 'food' | 'activity';
  };
}

export interface ItineraryDay {
  id: string;
  date: string;
  items: ItineraryItem[];
}

export interface ItineraryState {
  activeDayId: string;
  expandedItems: Set<string>;
}
