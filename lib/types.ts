export interface Permission {
  moduleId: string;
  moduleName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  password: string;
  permissions: Permission[];
}

export interface Showing {
  id: string
  date: Date
  time: string
  property: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  leadName?: string
  leadId?: string
}

export interface Task {
  id: string;
  title: string;
  date: string;  // ISO date string format
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
}

export interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  leadStatus: string;
  leadType: string;
  property: string;
  notes: string;
  assignedTo?: string;
  date: string;
  callHistory: any[];
  tasks: any[];
  showings?: Showing[];
  propertyPreferences: {
    budget: {
      min: number;
      max: number;
    };
    propertyType: string[];
    bedrooms: number;
    bathrooms: number;
    locations: string[];
    features: string[];
  };
  leadResponse: string;
  leadSource: string;
  clientType: string;
  location: string;
  // New fields
  conversion: string;
  age: number;
  language: string;
  gender: string;
  religion: string;
  realtorAssociation: string;
  salesHistory: {
    closedSales: number;
    lastClosedDate: string;
  };
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type?: string
  description?: string
} 