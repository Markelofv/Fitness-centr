import { useEffect, useState } from 'react';
import { clientApi } from '../api/clientApi';
import Icon from '../components/ui/Icon';

export default function Schedule() {
  const [classes, setClasses] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const classesRes = await clientApi.getClasses();
      setClasses(classesRes.data);

      const bookingsRes = await clientApi.getMyBookings();
      setMyBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isBooked = (classId) => {
    return myBookings.some(b => b.class_id === classId && b.status === 'booked');
  };

  const getBookingId = (classId) => {
    const booking = myBookings.find(b => b.class_id === classId && b.status === 'booked');
    return booking ? booking.id : null;
  };

  const handleBook = async (classId) => {
    try {
      await clientApi.bookClass(classId);
      alert('Вы успешно записались!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка записи');
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Отменить запись?')) return;
    try {
      await clientApi.cancelBooking(bookingId);
      alert('Запись отменена');
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка отмены');
    }
  };

  if (loading) return <div className="p-8 text-[#2c172f]">Загрузка...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-[-.035em] md:text-3xl text-[#2c172f]">Расписание</h2>
        <p className="mt-2 text-sm text-[#927e92]">Запишитесь на ближайшие тренировки.</p>
      </div>

      <div className="grid gap-4">
        {classes.map((cls) => {
          const booked = isBooked(cls.id);
          const bookingId = getBookingId(cls.id);

          return (
            <div key={cls.id} className="portal-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#2c172f]">{cls.title}</h3>
                <p className="text-[#927e92] text-sm mt-1">{cls.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-[#796579] mt-3">
                  <span className="flex items-center gap-1.5">
                    <Icon name="calendar" className="size-4 text-[#a3125a]" />
                    {new Date(cls.start_time).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="location" className="size-4 text-[#a3125a]" />
                    {cls.hall}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="clock" className="size-4 text-[#a3125a]" />
                    {cls.duration_min} мин
                  </span>
                </div>
              </div>

              <div>
                {booked ? (
                  <button
                    onClick={() => handleCancel(bookingId)}
                    className="rounded-full border border-[#a3125a] bg-[#fff3f8] text-[#a3125a] px-6 py-2.5 text-xs font-bold transition hover:bg-[#fce4ef]"
                  >
                    Отменить запись
                  </button>
                ) : (
                  <button
                    onClick={() => handleBook(cls.id)}
                    className="gradient-button px-6 py-2.5 text-xs"
                  >
                    Записаться
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {classes.length === 0 && (
          <p className="text-[#927e92]">Пока нет доступных занятий.</p>
        )}
      </div>
    </div>
  );
}