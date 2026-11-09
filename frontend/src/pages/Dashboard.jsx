import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#a3125a] uppercase">
          {user?.role === 'admin' ? 'Администратор' : user?.role === 'trainer' ? 'Тренер' : 'Клиент'}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-.035em] md:text-3xl text-[#2c172f]">
          Добрый день, {user?.full_name?.split(' ')[0] || 'Гость'}!
        </h2>
        <p className="mt-2 text-sm text-[#927e92]">Вот что происходит сегодня.</p>
      </div>

      <div className="portal-card p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
        <div className="size-16 rounded-full bg-[#f5e5ef] flex items-center justify-center text-[#a3125a] mb-4">
          <span className="text-2xl font-bold">F</span>
        </div>
        <h3 className="text-xl font-bold text-[#2c172f] mb-2">Добро пожаловать в FitManager</h3>
        <p className="text-[#927e92] max-w-md">
          Используйте меню слева, чтобы просмотреть расписание занятий или купить абонемент.
        </p>
      </div>
    </div>
  );
}