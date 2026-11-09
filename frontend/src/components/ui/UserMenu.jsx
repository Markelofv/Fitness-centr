import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function UserMenu() {
  const { user } = useAuthStore();

  if (!user) return null;

  const initials = user.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U';

  return (
    <Link
      to="/dashboard"
      className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 transition hover:border-white/30 hover:bg-white/10"
    >
      <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#c02688] to-[#7c3aed] text-[10px] font-bold text-white shadow-[0_0_15px_rgba(192,38,136,.4)]">
        {initials}
      </span>
      <span className="hidden text-xs font-bold text-white/80 sm:block group-hover:text-white">
        {user.full_name.split(' ')[0]}
      </span>
    </Link>
  );
}