export interface SessionOption {
  id: string;
  price: number;
  isCustom?: boolean;
  baseHours: number;
}

export interface AddOn {
  id: string;
  price: number;
  estimatedHours: number;
}

export interface ResultPackage {
  id: string;
  price: number;
  includesMastering?: boolean;
}

export const SESSIONS: SessionOption[] = [
  { id: '4h', price: 4500, baseHours: 4 },
  { id: '8h', price: 8500, baseHours: 8 },
  { id: 'custom', price: 0, isCustom: true, baseHours: 4 },
  { id: 'remote', price: 0, isCustom: false, baseHours: 0 },
];

export const ADDONS: AddOn[] = [
  { id: 'arrangement', price: 1500, estimatedHours: 2 },
  { id: 'vocal', price: 2000, estimatedHours: 3 },
  { id: 'sound-design', price: 1500, estimatedHours: 2 },
  { id: 'extra-revision', price: 1000, estimatedHours: 1 },
  { id: 'express', price: 2500, estimatedHours: 0 },
];

export const RESULT_PACKAGES: ResultPackage[] = [
  { id: 'session-only', price: 0 },
  { id: 'record-your-song', price: 8900 },
  { id: 'radio-ready', price: 18000, includesMastering: true },
  { id: 'ep-package', price: 45000, includesMastering: true },
];

export const MASTERING_PRICE_PER_TRACK = 1500;

export const CREATIVE_TYPES = [
  'new-song',
  'develop-existing',
  'topline',
  'beat-production',
  'mixing',
  'other',
] as const;

export const MIXING_SCOPES = ['0-20', '20-50', '50+'] as const;

export type BookingState = {
  step: number;
  workMode: 'studio' | 'remote' | '';
  session: string;
  customSessionText: string;
  creativeTypes: string[];
  creativeOtherText: string;
  addOns: string[];
  mastering: 'none' | 'per-track';
  masteringTracks: number;
  resultPackage: string;
  mixingScope: string;
  songCount: string;
  trackCount: string;
  referenceUrl: string;
  deadline: Date | undefined;
  description: string;
  name: string;
  email: string;
  phone: string;
  paymentChoice: 'deposit' | 'full';
  promoCode: string;
};

export const initialBookingState: BookingState = {
  step: 1,
  workMode: '',
  session: '',
  customSessionText: '',
  creativeTypes: [],
  creativeOtherText: '',
  addOns: [],
  mastering: 'none',
  masteringTracks: 1,
  resultPackage: '',
  mixingScope: '',
  songCount: '',
  trackCount: '',
  referenceUrl: '',
  deadline: undefined,
  description: '',
  name: '',
  email: '',
  phone: '',
  paymentChoice: 'deposit',
  promoCode: '',
};

export type BookingAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_WORK_MODE'; workMode: 'studio' | 'remote' }
  | { type: 'SET_SESSION'; session: string }
  | { type: 'SET_CUSTOM_SESSION_TEXT'; text: string }
  | { type: 'TOGGLE_CREATIVE_TYPE'; id: string }
  | { type: 'SET_CREATIVE_OTHER_TEXT'; text: string }
  | { type: 'TOGGLE_ADDON'; id: string }
  | { type: 'SET_MASTERING'; value: 'none' | 'per-track' }
  | { type: 'SET_MASTERING_TRACKS'; count: number }
  | { type: 'SET_RESULT_PACKAGE'; id: string }
  | { type: 'SET_MIXING_SCOPE'; scope: string }
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'RESET' };

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_WORK_MODE':
      return { ...state, workMode: action.workMode };
    case 'SET_SESSION':
      return { ...state, session: action.session };
    case 'SET_CUSTOM_SESSION_TEXT':
      return { ...state, customSessionText: action.text };
    case 'TOGGLE_CREATIVE_TYPE': {
      const types = state.creativeTypes.includes(action.id)
        ? state.creativeTypes.filter(t => t !== action.id)
        : [...state.creativeTypes, action.id];
      return { ...state, creativeTypes: types };
    }
    case 'SET_CREATIVE_OTHER_TEXT':
      return { ...state, creativeOtherText: action.text };
    case 'TOGGLE_ADDON': {
      const addOns = state.addOns.includes(action.id)
        ? state.addOns.filter(a => a !== action.id)
        : [...state.addOns, action.id];
      return { ...state, addOns };
    }
    case 'SET_MASTERING':
      return { ...state, mastering: action.value };
    case 'SET_MASTERING_TRACKS':
      return { ...state, masteringTracks: action.count };
    case 'SET_RESULT_PACKAGE':
      return { ...state, resultPackage: action.id };
    case 'SET_MIXING_SCOPE':
      return { ...state, mixingScope: action.scope };
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialBookingState;
    default:
      return state;
  }
}

export function calculateTotal(state: BookingState): number {
  let total = 0;
  const session = SESSIONS.find(s => s.id === state.session);
  const pkg = RESULT_PACKAGES.find(p => p.id === state.resultPackage);

  // Package price INCLUDES session — use the higher of the two, not both
  if (pkg && pkg.price > 0) {
    total += pkg.price;
  } else if (session) {
    total += session.price;
  }

  for (const addonId of state.addOns) {
    const addon = ADDONS.find(a => a.id === addonId);
    if (addon) total += addon.price;
  }

  if (pkg && !pkg.includesMastering && state.mastering === 'per-track') {
    total += state.masteringTracks * MASTERING_PRICE_PER_TRACK;
  } else if (!pkg && state.mastering === 'per-track') {
    total += state.masteringTracks * MASTERING_PRICE_PER_TRACK;
  }

  return total;
}

export function calculateWorkloadHours(state: BookingState): number {
  let hours = 0;
  const session = SESSIONS.find(s => s.id === state.session);
  if (session) hours += session.baseHours;

  for (const addonId of state.addOns) {
    const addon = ADDONS.find(a => a.id === addonId);
    if (addon) hours += addon.estimatedHours;
  }

  if (state.mastering === 'per-track') {
    hours += state.masteringTracks * 0.5;
  }

  return hours;
}

export function calculateMinDeadlineDays(workloadHours: number): number {
  return Math.max(5, Math.ceil(workloadHours / 4));
}
