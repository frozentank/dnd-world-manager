export interface NPC {
  id: number;
  name: string;
  title?: string;
  description?: string;
  personality?: string;
  appearance?: string;
  secrets?: string;
  notes?: string;
  active: boolean;
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  location_type: string;
  is_major: boolean;
}

export interface ScheduleRule {
  id: number;
  npc_id: number;
  location_id: number;
  name: string;
  priority: number;
  start_minute: number;
  end_minute: number;
  day_of_week?: number;
  probability: number;
  condition?: string;
  enabled: boolean;
}
