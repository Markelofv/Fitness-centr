import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';
import Logo from './ui/Logo';
import Icon from './ui/Icon';

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Проверка сессии при обновлении страницы (F5)
  useEffect(() => {
    if (!user) {
      api.get('/api/auth/me').then((res) => {
        useAuthStore.getState().setAuth(res.data, localStorage.getItem('token'));
      }).catch(() => {
        useAuthStore.getState().logout();
      });
    }
  }, [user]);

  // Определяем меню в зависимости от роли
  const menu = user?.role === 'admin'
    ? [
        { label: 'Обзор', icon: 'bar', path: '/dashboard' },
        { label: 'Клиенты', icon: 'people', path: '/clients' },
        { label: 'Расписание', icon: 'calendar', path: '/schedule' },
        { label: 'Профиль', icon: 'user', path: '/profile' },
      ]
    : [
        { label: 'Обзор', icon: 'bar', path: '/dashboard' },
        { label: 'Расписание', icon: 'calendar', path: '/schedule' },
        { label: 'Абонемент', icon: 'spark', path: '/membership' },
        { label: 'Профиль', icon: 'user', path: '/profile' },
      ];

  return (
    <div className="min-h-screen bg-[#f7f2f7] text-[#2c172f]">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col bg-[#170d1c] p-4 text-white transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-2 py-3">
          {/* Логотип ведет на главную страницу лендинга */}
          <Logo onHome={() => navigate('/')} />
        </div>

        <p className="mb-3 mt-9 px-3 text-[9px] font-bold uppercase tracking-[.16em] text-white/25">
          {user?.role === 'admin' ? 'Администратор' : user?.role === 'trainer' ? 'Тренер' : 'Клиент'}
        </p>

        <nav className="space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`portal-nav ${location.pathname === item.path ? 'portal-nav-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon name={item.icon} className="size-4.5" /> {item.label}
            </Link>
          ))}
        </nav>

        {/* Блок с информацией о пользователе (внизу) */}
        <div className="mt-auto border-t border-white/[.08] pt-4">
          <div className="flex items-center gap-3 px-2">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#c02688] to-[#7c3aed] text-[10px] font-bold uppercase">
              {user?.full_name?.substring(0, 2) || 'U'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">{user?.full_name}</p>
              <p className="mt-1 text-[10px] text-white/35">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Мобильное затемнение при открытом меню */}
      {menuOpen && (
        <button
          className="fixed inset-0 z-40 bg-[#100815]/60 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Закрыть меню"
        />
      )}

      {/* Основной контент */}
      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#e8dee8] bg-white/90 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid size-10 place-items-center rounded-xl border border-[#e6dae6] lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <div>
              <h1 className="text-base font-bold md:text-lg">FitManager</h1>
              <p className="hidden text-[10px] text-[#a18fa1] sm:block">Панель управления</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#c02688] to-[#7c3aed] text-[10px] font-bold text-white uppercase">
              {user?.full_name?.substring(0, 2) || 'U'}
            </span>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <div className="mx-auto max-w-[1240px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}