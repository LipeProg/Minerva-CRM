interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Minerva CRM</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">{subtitle}</p>}
    </div>
  );
};

export default Header;
