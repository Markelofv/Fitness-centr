import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Logo from '../components/ui/Logo';
import { useAuthStore } from '../store/authStore';
import UserMenu from '../components/ui/UserMenu';

// ... (массивы photos, programs, trainers, plans остаются без изменений) ...
const photos = {
  hero: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=1800",
  strength: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1100",
  cardio: "https://images.unsplash.com/photo-1728486145245-d4cb0c9c3470?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
  functional: "https://images.unsplash.com/photo-1584863231364-2edc166de576?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1100",
  coach1: "https://images.unsplash.com/photo-1574680088814-c9e8a10d8a4d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  coach2: "https://images.unsplash.com/photo-1594381898411-846e7d193883?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  coach3: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
};
const programs = [
  { number: "01", title: "Силовой тренинг", tag: "POWER", text: "Свободные веса, тренажёры и персональная программа под твою цель.", image: photos.strength },
  { number: "02", title: "Кардио-зона", tag: "ENDURANCE", text: "Технологичное оборудование и тренировки для сильного сердца.", image: photos.cardio },
  { number: "03", title: "Функциональный", tag: "MOVE", text: "Интенсивные классы, которые развивают силу, ловкость и выносливость.", image: photos.functional },
];
const trainers = [
  { name: "Виктория Рэй", role: "Силовой тренинг", experience: "8 лет опыта", description: "Помогает стать сильнее, освоить технику базовых упражнений и полюбить работу с весами.", image: photos.coach1 },
  { name: "Мария Лисова", role: "Yoga & Stretching", experience: "6 лет опыта", description: "Создаёт практики для гибкости, здоровой спины и внутреннего баланса без гонки за результатом.", image: photos.coach2 },
  { name: "Алина Мороз", role: "Функциональный тренинг", experience: "7 лет опыта", description: "Развивает силу, координацию и выносливость через динамичные тренировки для всего тела.", image: photos.coach3 },
];
const plans = [
  { name: "START", price: "3 900", note: "Для знакомства с клубом", features: ["8 посещений в месяц", "Тренажёрный зал", "Групповые программы"] },
  { name: "UNLIMITED", price: "6 900", note: "Тренируйся без границ", features: ["Безлимитные посещения", "Все групповые программы", "1 гостевой визит", "Заморозка 14 дней"], popular: true },
  { name: "PERSONAL", price: "12 900", note: "Максимум внимания", features: ["Безлимитные посещения", "4 тренировки с тренером", "Диагностика тела", "Заморозка 30 дней"] },
];

export default function Landing() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen overflow-hidden bg-[#0f0913] text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[.08] bg-[#0f0913]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16">
          <Logo />
          <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[.12em] lg:flex">
            {/* "О клубе" ведет на якорь top */}
            <a className="nav-link" href="#top">О клубе</a>
            <a className="nav-link" href="#programs">Направления</a>
            <a className="nav-link" href="#trainers">Тренеры</a>
            <a className="nav-link" href="#prices">Цены</a>
          </nav>
          <div className="hidden items-center gap-5 sm:flex">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 text-[10px] font-bold tracking-[.08em] text-white/70 transition hover:border-pink-300/40 hover:text-white">
                  <Icon name="user" className="size-4" /> КАБИНЕТ
                </Link>
                <Link to="/login" className="gradient-button px-5 py-3 text-xs">ПРОБНАЯ ТРЕНИРОВКА</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ID="top" для скролла наверх */}
        <section id="top" className="relative min-h-[820px] overflow-hidden pt-[76px] md:min-h-[900px]">
          <img src={photos.hero} alt="Атлетка" className="absolute inset-0 h-full w-full object-cover object-[64%_center]" />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute right-[6%] top-32 size-[420px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
          <div className="relative mx-auto flex min-h-[744px] max-w-[1440px] items-center px-5 py-20 md:min-h-[824px] md:px-10 lg:px-16">
            <div className="max-w-[900px]">
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-fuchsia-200 backdrop-blur">
                <span className="size-1.5 rounded-full bg-[#ff4f9a] shadow-[0_0_12px_#ff4f9a]" /> Твоя энергия. Твои правила.
              </div>
              <h1 className="heading text-[clamp(4rem,9.2vw,9rem)] font-bold leading-[.87] tracking-[-.065em]">
                БОЛЬШЕ,<br />ЧЕМ <span className="gradient-text">ФИТНЕС</span>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-white/60 md:text-lg">
                Пространство, где движение становится силой, а каждый новый результат — частью твоей истории.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link to={user ? "/dashboard" : "/login"} className="gradient-button group flex items-center justify-center gap-7 px-7 py-4 text-xs">
                  {user ? "ПЕРЕЙТИ В КАБИНЕТ" : "НАЧАТЬ БЕСПЛАТНО"}
                  <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="club" className="relative bg-[#130b18]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
            {[["2 400", "м² пространства"], ["45+", "тренеров"], ["50", "занятий в неделю"], ["08–23", "время работы"]].map(([value, label]) => (
              <div key={label} className="border-b border-r border-white/[.07] px-5 py-8 md:border-b-0 md:px-8 md:py-10">
                <p className="heading text-4xl font-semibold tracking-[-.04em] md:text-5xl">{value}</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[.14em] text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="programs" className="relative px-5 py-24 md:px-10 md:py-32 lg:px-16">
          <div className="relative mx-auto max-w-[1312px]">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">ВЫБЕРИ СВОЙ РИТМ</p>
                <h2 className="section-title mt-4">ДВИЖЕНИЕ,<br />КОТОРОЕ <span className="text-[#ff4f9a]">МЕНЯЕТ</span></h2>
              </div>
            </div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {programs.map((program) => (
                <article key={program.number} className="program-card group relative min-h-[540px] overflow-hidden rounded-[22px]">
                  <img src={program.image} alt={program.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18091e] via-[#18091e]/25 to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
                    <span className="text-xs font-bold text-white/50">{program.number}</span>
                    <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[9px] font-bold tracking-[.16em] backdrop-blur">{program.tag}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <h3 className="heading text-3xl font-semibold tracking-[-.04em]">{program.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/55">{program.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="trainers" className="relative px-5 py-24 md:px-10 md:py-32 lg:px-16">
          <div className="relative mx-auto max-w-[1312px]">
            <p className="eyebrow">КОМАНДА FitManager</p>
            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="section-title">РЯДОМ С ТОБОЙ<br /><span className="gradient-text">НА КАЖДОМ ШАГЕ</span></h2>
            </div>
            <div className="mt-14 grid gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {trainers.map((trainer) => (
                <article key={trainer.name} className="group flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#24132b]">
                    <img src={trainer.image} alt={trainer.name} className="h-full w-full object-cover grayscale-[30%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2e0b2d]/75 via-transparent to-transparent" />
                    <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-[#170d1c]/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] backdrop-blur">{trainer.experience}</span>
                  </div>
                  <h3 className="heading mt-5 text-2xl font-semibold">{trainer.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#df5b9a]">{trainer.role}</p>
                  <p className="mt-4 text-sm leading-6 text-white/45">{trainer.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="prices" className="relative overflow-hidden bg-gradient-to-br from-[#6d1554] via-[#6b1e79] to-[#4c1d95] px-5 py-24 md:px-10 md:py-28 lg:px-16">
          <div className="relative mx-auto max-w-[1312px]">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-pink-200">АБОНЕМЕНТЫ</p>
              <h2 className="section-title mt-4">ВЫБЕРИ СВОЙ ТАРИФ</h2>
            </div>
            <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.name} className={`relative flex flex-col rounded-[22px] border p-7 backdrop-blur-xl md:p-8 ${plan.popular ? "border-pink-300/60 bg-white text-[#29132e] shadow-[0_24px_70px_rgba(31,5,37,.25)]" : "border-white/15 bg-[#1d0f27]/35 text-white"}`}>
                  {plan.popular && <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-[#a3125a] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-white">Выбор резидентов</span>}
                  <p className={`text-[10px] font-bold tracking-[.16em] ${plan.popular ? "text-[#a3125a]" : "text-pink-200"}`}>{plan.name}</p>
                  <p className="mt-5 flex items-end gap-2">
                    <span className="heading text-5xl font-semibold tracking-[-.05em]">{plan.price}</span>
                    <span className={`pb-1 text-sm ${plan.popular ? "text-[#7c657c]" : "text-white/45"}`}>₽ / мес.</span>
                  </p>
                  <p className={`mt-3 text-sm ${plan.popular ? "text-[#7c657c]" : "text-white/45"}`}>{plan.note}</p>
                  <ul className={`mt-7 flex-1 space-y-4 border-t pt-6 ${plan.popular ? "border-[#e9dbe9]" : "border-white/10"}`}>
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <span className={`grid size-6 place-items-center rounded-full ${plan.popular ? "bg-[#f8e5ef] text-[#a3125a]" : "bg-white/10 text-pink-200"}`}>
                          <Icon name="check" className="size-3.5" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={user ? "/membership" : "/login"} className={`mt-8 rounded-full py-4 text-center text-xs font-bold tracking-[.08em] transition ${plan.popular ? "bg-[#84164f] text-white hover:bg-[#a3125a]" : "border border-white/25 hover:border-white/60 hover:bg-white/5"}`}>
                    {user ? "ПЕРЕЙТИ К ОПЛАТЕ" : "ВЫБРАТЬ ТАРИФ"}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacts" className="relative overflow-hidden px-5 py-24 text-center md:px-10 md:py-32">
          <div className="relative mx-auto max-w-4xl">
            <h2 className="heading mt-7 text-[clamp(3.2rem,7vw,6.8rem)] font-bold leading-[.93] tracking-[-.06em]">
              ТВОЙ НОВЫЙ РИТМ<br /><span className="gradient-text">НАЧИНАЕТСЯ ЗДЕСЬ</span>
            </h2>
            <Link to={user ? "/dashboard" : "/login"} className="gradient-button mt-9 inline-block px-9 py-4 text-xs">
              {user ? "ОТКРЫТЬ КАБИНЕТ" : "ПОПРОБОВАТЬ БЕСПЛАТНО"}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[.08] bg-[#0b070e]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 md:grid-cols-3 md:px-10 lg:px-16">
          <div><Logo /></div>
          <div className="text-sm text-white/60">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[.14em] text-white/30">Контакты</p>
            <p className="flex items-center gap-2"><Icon name="location" className="size-4 text-[#ff4f9a]" /> Москва, ул. Большая Дмитровка, 21</p>
            <p className="mt-3 flex items-center gap-2"><Icon name="clock" className="size-4 text-[#ff4f9a]" /> Ежедневно, 08:00–23:00</p>
          </div>
          <div className="md:text-right">
            <a className="heading text-2xl font-semibold" href="tel:+74951234567">+7 (495) 123-45-67</a>
          </div>
        </div>
      </footer>
    </div>
  );
}