'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'DB' },
    { href: '/clientes', label: 'Clientes', icon: 'CL' },
    { href: '/leads', label: 'Leads', icon: 'LD' },
    { href: '/funil', label: 'Funil de Vendas', icon: 'FN' },
    { href: '/tarefas', label: 'Tarefas', icon: 'TF' },
    { href: '/interacoes', label: 'Interações', icon: 'IN' },
    { href: '/relatorios', label: 'Relatórios', icon: 'RP' },
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-64 overflow-y-auto border-r border-slate-200 bg-slate-950 text-white shadow-lg lg:block">
        <div className="border-b border-white/10 p-6">
          <Link href="/dashboard" className="block">
            <h1 className="text-2xl font-bold tracking-tight">Minerva</h1>
            <p className="mt-1 text-sm text-slate-300">CRM para pequenos negócios</p>
          </Link>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-2 flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-white text-slate-950 font-semibold'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="px-4 py-3">
          <Link href="/dashboard" className="text-lg font-bold text-slate-950">
            Minerva CRM
          </Link>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Sidebar;
