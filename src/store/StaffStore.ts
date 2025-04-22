
import { makeAutoObservable, runInAction } from 'mobx';
import { StaffMember } from '../types/Staff';

const LOCAL_STORAGE_KEY = 'clinic_staff_list';

export class StaffStore {
  staffList: StaffMember[] = [];
  search: string = '';

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage(); 
  }

  setStaff(data: StaffMember[]) {
    this.staffList = data;
    this.saveToLocalStorage(); 
  }

  addStaff(member: StaffMember) {
    this.staffList.push(member);
    this.saveToLocalStorage(); 
  }

  removeStaff(id: string) {
    this.staffList = this.staffList.filter(m => m.id !== id);
    this.saveToLocalStorage(); 
  }

  setSearch(value: string) {
    this.search = value;
  }

  get filteredList() {
    const query = this.search.toLowerCase();
    return this.staffList.filter(m => m.fullName.toLowerCase().includes(query));
  }

  saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.staffList));
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data) as StaffMember[];
        runInAction(() => {
          this.staffList = parsed;
        });
      } catch (e) {
        console.error('❌ Ошибка чтения localStorage:', e);
      }
    }
  }
}

export const staffStore = new StaffStore();
