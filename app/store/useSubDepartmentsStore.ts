import { create } from 'zustand';
import { ViewAllSubDepartments200ResponseDataInner } from '../../utils/api/generated/models/view-all-sub-departments200-response-data-inner';

interface SubDepartmentsState {
  subDepartments: ViewAllSubDepartments200ResponseDataInner[];
  setSubDepartments: (subDepartments: ViewAllSubDepartments200ResponseDataInner[]) => void;
  addSubDepartment: (subDepartment: ViewAllSubDepartments200ResponseDataInner) => void;
  removeSubDepartment: (id: string) => void;
  updateSubDepartment: (id: string, updates: Partial<ViewAllSubDepartments200ResponseDataInner>) => void;
  clearSubDepartments: () => void;
  getSubDepartmentById: (id: string) => ViewAllSubDepartments200ResponseDataInner | undefined;
  getSubDepartmentsByDepartmentId: (departmentId: string) => ViewAllSubDepartments200ResponseDataInner[];
}

export const useSubDepartmentsStore = create<SubDepartmentsState>((set, get) => ({
  subDepartments: [],
  
  setSubDepartments: (subDepartments) => set({ subDepartments }),
  
  addSubDepartment: (subDepartment) => set((state) => ({
    subDepartments: [...state.subDepartments, subDepartment]
  })),
  
  removeSubDepartment: (id) => set((state) => ({
    subDepartments: state.subDepartments.filter(dept => dept.id !== id)
  })),
  
  updateSubDepartment: (id, updates) => set((state) => ({
    subDepartments: state.subDepartments.map(dept => 
      dept.id === id ? { ...dept, ...updates } : dept
    )
  })),
  
  clearSubDepartments: () => set({ subDepartments: [] }),
  
  getSubDepartmentById: (id) => {
    const state = get();
    return state.subDepartments.find(dept => dept.id === id);
  },
  
  getSubDepartmentsByDepartmentId: (departmentId) => {
    const state = get();
    return state.subDepartments.filter(dept => dept.subDepartments?.includes(departmentId));
  }
}));
