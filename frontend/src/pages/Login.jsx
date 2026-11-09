import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/ui/Logo';
import Icon from '../components/ui/Icon';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await authApi.login(email, password);
      const token = data.access_token;

      const userRes = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAuth(userRes.data, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка входа. Проверьте данные.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[#09050c] p-4">
      <div className="relative my-auto w-full max-w-[500px] overflow-hidden rounded-[24px] border border-white/10 bg-[#1a1020] shadow-[0_35px_100px_rgba(0,0,0,.6)]">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-fuchsia-600/20 blur-[80px]" />

        <div className="relative p-7 md:p-10">
          <Logo />

          <div className="mt-7">
            <p className="eyebrow">С ВОЗВРАЩЕНИЕМ</p>
            <h2 className="heading mt-3 text-3xl font-semibold text-white">
              Войти в кабинет
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Используйте данные аккаунта, чтобы продолжить.
            </p>
          </div>

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <input
              className="modal-input"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="modal-input"
              type="password"
              placeholder="Пароль"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="rounded-xl bg-[#d946a1]/10 px-4 py-3 text-center text-xs font-medium text-[#f6a3ca]" role="status">
                {error}
              </p>
            )}

            <button type="submit" className="gradient-button mt-3 flex w-full items-center justify-between px-6 py-4 text-xs">
              ВОЙТИ
              <Icon name="arrow" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Нет аккаунта? <Link to="/register" className="text-[#f277b2] hover:underline">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
}