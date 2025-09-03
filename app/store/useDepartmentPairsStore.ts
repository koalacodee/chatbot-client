import { create } from 'zustand';

interface DepartmentPair {
  mainDepartmentId: string | null;
  subDepartmentId: string | null;
}

interface DepartmentPairsStore extends DepartmentPair {
  setMainDepartmentId: (id: string | null) => void;
  setSubDepartmentId: (id: string | null) => void;
  setDepartmentPair: (mainId: string | null, subId: string | null) => void;
  clearDepartmentPair: () => void;
  clearSubDepartment: () => void;
}

export const useDepartmentPairsStore = create<DepartmentPairsStore>((set) => ({
  mainDepartmentId: null,
  subDepartmentId: null,
  
  setMainDepartmentId: (id) => set({ mainDepartmentId: id }),
  
  setSubDepartmentId: (id) => set({ subDepartmentId: id }),
  
  setDepartmentPair: (mainId, subId) => set({ 
    mainDepartmentId: mainId, 
    subDepartmentId: subId 
  }),
  
  clearDepartmentPair: () => set({ 
    mainDepartmentId: null, 
    subDepartmentId: null 
  }),
  
  clearSubDepartment: () => set({ subDepartmentId: null }),
}));
