import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/ui/Logo';
import Icon from '../components/ui/Icon';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. Отправляем данные на регистрацию
      const { data } = await authApi.register(formData);
      const token = data.access_token;

      // 2. Сразу получаем данные пользователя (чтобы залогинить)
      const userRes = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Сохраняем в Zustand и переходим в кабинет
      setAuth(userRes.data, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка регистрации. Проверьте данные.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[#09050c] p-4">
      <div className="relative my-auto w-full max-w-[500px] overflow-hidden rounded-[24px] border border-white/10 bg-[#1a1020] shadow-[0_35px_100px_rgba(0,0,0,.6)]">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-fuchsia-600/20 blur-[80px]" />

        <div className="relative p-7 md:p-10">
          <Logo />

          <div className="mt-7">
            <p className="eyebrow">НОВЫЙ АККАУНТ</p>
            <h2 className="heading mt-3 text-3xl font-semibold text-white">
              Стать частью FitManager
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Создайте профиль, чтобы записываться на тренировки.
            </p>
          </div>

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <input
              className="modal-input"
              type="text"
              name="full_name"
              placeholder="ФИО"
              required
              value={formData.full_name}
              onChange={handleChange}
            />
            <input
              className="modal-input"
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              className="modal-input"
              type="tel"
              name="phone"
              placeholder="Телефон"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              className="modal-input"
              type="password"
              name="password"
              placeholder="Пароль"
              required
              value={formData.password}
              onChange={handleChange}
            />

            {error && (
              <p className="rounded-xl bg-[#d946a1]/10 px-4 py-3 text-center text-xs font-medium text-[#f6a3ca]" role="status">
                {error}
              </p>
            )}

            <button type="submit" className="gradient-button mt-3 flex w-full items-center justify-between px-6 py-4 text-xs">
              СОЗДАТЬ АККАУНТ
              <Icon name="arrow" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/40">
            Уже есть аккаунт? <Link to="/login" className="text-[#f277b2] hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}