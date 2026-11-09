import { useEffect, useState } from 'react';
import { clientApi } from '../api/clientApi';
import Icon from '../components/ui/Icon';

export default function Membership() {
  const [types, setTypes] = useState([]);
  const [myMembership, setMyMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const typesRes = await clientApi.getTypes();
      setTypes(typesRes.data);

      try {
        const myRes = await clientApi.getMyMembership();
        setMyMembership(myRes.data);
      } catch (err) {
        setMyMembership(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBuy = async (typeId) => {
    try {
      await clientApi.buyMembership(typeId);
      alert('Абонемент успешно куплен!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка при покупке');
    }
  };

  if (loading) return <div className="p-8 text-[#2c172f]">Загрузка...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-[-.035em] md:text-3xl text-[#2c172f]">Абонементы</h2>
        <p className="mt-2 text-sm text-[#927e92]">Управляйте вашим абонементом и покупайте новые.</p>
      </div>

      {/* Текущий абонемент */}
      <div className="portal-card p-6 mb-8 border-l-4 border-[#a3125a]">
        <h3 className="text-lg font-bold text-[#2c172f] mb-4">Ваш текущий абонемент</h3>
        {myMembership ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#8a758a]">Статус</p>
              <p className="font-bold text-[#21834b] uppercase">{myMembership.status === 'active' ? 'Активен' : myMembership.status}</p>
            </div>
            <div>
              <p className="text-xs text-[#8a758a]">Действует до</p>
              <p className="font-bold text-[#2c172f]">{new Date(myMembership.end_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-[#8a758a]">Остаток визитов</p>
              <p className="font-bold text-[#2c172f]">{myMembership.visits_left === null ? 'Безлимит' : myMembership.visits_left}</p>
            </div>
            <div>
              <p className="text-xs text-[#8a758a]">ID тарифа</p>
              <p className="font-bold text-[#2c172f]">{myMembership.type_id}</p>
            </div>
          </div>
        ) : (
          <p className="text-[#a3125a]">У вас нет активного абонемента. Выберите тариф ниже.</p>
        )}
      </div>

      {/* Витрина тарифов */}
      <h3 className="text-xl font-bold text-[#2c172f] mb-4">Доступные тарифы</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {types.map((type) => (
          <div key={type.id} className="portal-card p-6 flex flex-col">
            <h4 className="text-lg font-bold text-[#2c172f] mb-2">{type.name}</h4>
            <p className="text-3xl font-bold text-[#a3125a] mb-4">{type.price} ₽</p>
            <ul className="text-sm text-[#796579] mb-6 space-y-2 flex-1">
              <li className="flex items-center gap-2"><Icon name="check" className="size-4 text-[#21834b]" /> Срок: {type.duration_days} дней</li>
              <li className="flex items-center gap-2"><Icon name="check" className="size-4 text-[#21834b]" /> Визиты: {type.visits_limit === null ? 'Безлимит' : type.visits_limit}</li>
            </ul>
            <button
              onClick={() => handleBuy(type.id)}
              className="gradient-button w-full py-3 text-xs"
            >
              КУПИТЬ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}