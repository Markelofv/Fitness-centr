import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-[-.035em] md:text-3xl text-[#2c172f]">
          Мой профиль
        </h2>
        <p className="mt-2 text-sm text-[#927e92]">Ваши личные данные в системе.</p>
      </div>

      <div className="portal-card p-6 md:p-8 max-w-2xl">
        <div className="flex items-center gap-5 mb-8">
          <span className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-[#c02688] to-[#7c3aed] text-2xl font-bold text-white uppercase">
            {user?.full_name?.substring(0, 2) || 'U'}
          </span>
          <div>
            <h3 className="text-xl font-bold text-[#2c172f]">{user?.full_name}</h3>
            <p className="text-[#a3125a] font-semibold uppercase text-xs mt-1">
              {user?.role === 'admin' ? 'Администратор' : user?.role === 'trainer' ? 'Тренер' : 'Клиент'}
            </p>
          </div>
        </div>

        <div className="space-y-4 border-t border-[#eee5ee] pt-6">
          <div className="flex justify-between items-center py-2 border-b border-[#f7f2f7]">
            <span className="text-[#796579] flex items-center gap-2">
              <Icon name="user" className="size-4" /> Email
            </span>
            <span className="font-bold text-[#2c172f]">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#f7f2f7]">
            <span className="text-[#796579] flex items-center gap-2">
              <Icon name="phone" className="size-4" /> Телефон
            </span>
            <span className="font-bold text-[#2c172f]">{user?.phone || 'Не указан'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[#796579] flex items-center gap-2">
              <Icon name="calendar" className="size-4" /> Статус аккаунта
            </span>
            <span className="font-bold text-[#21834b] bg-[#edf9f1] px-3 py-1 rounded-full text-xs">
              Активен
            </span>
          </div>
        </div>

        {/* Кнопка выхода */}
        <div className="mt-8 pt-6 border-t border-[#eee5ee]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
          >
            <Icon name="arrow" className="size-4 rotate-180" />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}