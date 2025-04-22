import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { staffStore } from '../store/StaffStore';
import { formatDate } from '../utils/date';
import styles from '../App.module.css';

const StaffDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const staff = staffStore.staffList.find(s => s.id === id);

  if (!staff) {
    return (
      <div className={styles.container}>
        <h2>Сотрудник не найден</h2>
        <Link to="/">← Назад к списку</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Карточка сотрудника</h2>
      <p><strong>ФИО:</strong> {staff.fullName}</p>
      <p><strong>Должность:</strong> {staff.position}</p>
      <p><strong>Дата рождения:</strong> {formatDate(staff.birthDate)}</p>
      <p><strong>Дата приёма на работу:</strong> {formatDate(staff.hireDate)}</p>
      <p><strong>Телефон:</strong> {staff.phone}</p>
      <Link to="/">← Назад к списку</Link>
    </div>
  );
});

export default StaffDetails;
