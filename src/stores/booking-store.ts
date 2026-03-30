import { create } from "zustand";

interface BookingState {
  step: number;
  providerId: string | null;
  providerName: string | null;
  categoryId: string | null;
  serviceName: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  durationHours: number;
  addressText: string;
  latitude: number | null;
  longitude: number | null;
  hourlyRate: number;
  paymentMethod: "stripe" | "cash" | null;
  notes: string;

  setStep: (step: number) => void;
  setProvider: (id: string, name: string, rate: number) => void;
  setService: (categoryId: string, name: string) => void;
  setDateTime: (date: string, time: string) => void;
  setDuration: (hours: number) => void;
  setLocation: (address: string, lat: number, lng: number) => void;
  setPaymentMethod: (method: "stripe" | "cash") => void;
  setNotes: (notes: string) => void;
  getSubtotal: () => number;
  getPlatformFee: () => number;
  getTotal: () => number;
  reset: () => void;
}

const PLATFORM_FEE_PERCENT = 15;

const initialState = {
  step: 1,
  providerId: null,
  providerName: null,
  categoryId: null,
  serviceName: null,
  scheduledDate: null,
  scheduledTime: null,
  durationHours: 1,
  addressText: "",
  latitude: null,
  longitude: null,
  hourlyRate: 0,
  paymentMethod: null as "stripe" | "cash" | null,
  notes: "",
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setProvider: (id, name, rate) =>
    set({ providerId: id, providerName: name, hourlyRate: rate }),
  setService: (categoryId, name) =>
    set({ categoryId, serviceName: name }),
  setDateTime: (date, time) =>
    set({ scheduledDate: date, scheduledTime: time }),
  setDuration: (hours) => set({ durationHours: hours }),
  setLocation: (address, lat, lng) =>
    set({ addressText: address, latitude: lat, longitude: lng }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setNotes: (notes) => set({ notes }),

  getSubtotal: () => {
    const { hourlyRate, durationHours } = get();
    return hourlyRate * durationHours;
  },
  getPlatformFee: () => {
    const subtotal = get().getSubtotal();
    return Math.round(subtotal * (PLATFORM_FEE_PERCENT / 100));
  },
  getTotal: () => {
    return get().getSubtotal() + get().getPlatformFee();
  },
  reset: () => set(initialState),
}));
