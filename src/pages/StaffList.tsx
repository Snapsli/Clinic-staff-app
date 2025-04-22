
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { staffStore } from '../store/StaffStore';
import { StaffMember } from '../types/Staff';
import { formatDate } from '../utils/date';
import styles from './StaffList.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';
import { differenceInYears } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const StaffList = observer(() => {
  const [sortKey, setSortKey] = useState<'fullName' | 'position' | 'hireDate'>('fullName');
  const [sortAsc, setSortAsc] = useState(true);
  const [positionFilter, setPositionFilter] = useState(() => localStorage.getItem('positionFilter') || '');
  const [searchValue, setSearchValue] = useState(() => localStorage.getItem('searchValue') || '');
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [hireDate, setHireDate] = useState<Date | null>(null);
  const [phone, setPhone] = useState('');

  const positionOptions = ['Директор', 'Менеджер', 'Стоматолог', 'Медсестра'];

  
  useEffect(() => {
    
    const savedLocal = localStorage.getItem('staffList');
    const localStaff: StaffMember[] = savedLocal ? JSON.parse(savedLocal) : [];
  
   
    fetch('https://api.mock.sb21.ru/api/v1/users?sort=id')
      .then(res => res.json())
      .then((res: any) => {
        const apiList: StaffMember[] = res.data.items.map((item: any) => ({
          id: String(item.id),
          fullName: `${item.surname} ${item.name} ${item.patronymic}`,
          position: item.medical_position?.label || item.administrative_position?.label || '',
          birthDate: new Date(item.created_at * 1000).toISOString(),
          hireDate: new Date(item.hired_at * 1000).toISOString(),
          phone: item.phone,
        }));
  
        
        const filteredLocal = localStaff.filter(local =>
          !apiList.some(api => api.id === local.id)
        );
  
       
        const merged = [...apiList, ...filteredLocal];
  
        staffStore.setStaff(merged);
      })
      .catch(console.error);
  }, []);
  

  useEffect(() => {
    staffStore.setSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    localStorage.setItem('positionFilter', positionFilter);
  }, [positionFilter]);

  useEffect(() => {
    localStorage.setItem('searchValue', staffStore.search);
  }, [staffStore.search]);

useEffect(() => {
  const localOnly = staffStore.staffList.filter((s) => s.id.includes('-'));
  localStorage.setItem('staffList', JSON.stringify(localOnly));
}, [staffStore.staffList]);


  useEffect(() => {
    localStorage.setItem('staffList', JSON.stringify(staffStore.staffList));
  }, [staffStore.staffList]);

  const filteredAndSorted = staffStore.filteredList
    .filter((s) => (positionFilter ? s.position === positionFilter : true))
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

  const handleSort = (key: 'fullName' | 'position' | 'hireDate') => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !position || !birthDate || !hireDate || !phone) return;

    const newStaff: StaffMember = {
      id: uuidv4(),
      fullName,
      position,
      birthDate: birthDate.toISOString(),
      hireDate: hireDate.toISOString(),
      phone,
    };

    staffStore.addStaff(newStaff);

    setFullName('');
    setPosition('');
    setBirthDate(null);
    setHireDate(null);
    setPhone('');
  };

  const handleDelete = (id: string) => {
    staffStore.removeStaff(id);
  };

  const uniquePositions = Array.from(new Set(staffStore.staffList.map((s) => s.position)));

  return (
    <div className={styles.container}>
      <h1>Список сотрудников клиники</h1>

      <input
        type="text"
        placeholder="Поиск по ФИО"
        value={staffStore.search}
        onChange={e => setSearchValue(e.target.value)}
        className={styles.search}
      />

      <select value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>
        <option value="">Все должности</option>
        {uniquePositions.map((pos) => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>

      <form onSubmit={handleAdd} className={styles.form}>
        <h2>Добавить сотрудника</h2>
        <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="ФИО" required />
        <select value={position} onChange={e => setPosition(e.target.value)} required>
          <option value="">Выберите должность</option>
          {positionOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <DatePicker selected={birthDate} onChange={setBirthDate} placeholderText="Дата рождения" />
        <DatePicker selected={hireDate} onChange={setHireDate} placeholderText="Дата приёма на работу" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Телефон" required />
        <button type="submit">Добавить</button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('fullName')}>ФИО</th>
            <th onClick={() => handleSort('position')}>Должность</th>
            <th>Дата рождения</th>
            <th onClick={() => handleSort('hireDate')}>Принят на работу</th>
            <th>Телефон</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSorted.map((staff) => {
            const age = differenceInYears(new Date(), new Date(staff.birthDate));
            return (
              <tr key={staff.id}>
                <td
                  data-tooltip-id={`tooltip-${staff.id}`}
                  data-tooltip-content={`Возраст: ${age} лет`}
                >
                  {staff.fullName}
                  <Tooltip id={`tooltip-${staff.id}`} />
                </td>
                <td>{staff.position}</td>
                <td>{formatDate(staff.birthDate)}</td>
                <td>{formatDate(staff.hireDate)}</td>
                <td>{staff.phone}</td>
                <td>
                  <button onClick={() => handleDelete(staff.id)}>✖</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default StaffList;
