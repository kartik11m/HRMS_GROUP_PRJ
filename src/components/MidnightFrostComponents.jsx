export const Card = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-gradient-to-br from-[#0b1120] to-[#0a0d15] border border-[#1f2937] shadow-xl',
    highlighted: 'bg-gradient-to-br from-[#1f3a7d]/30 to-[#0b1120] border border-[#88aaff]/30 shadow-lg shadow-[#88aaff]/10',
    elevated: 'bg-[#0b1120] border border-[#2c50ab]/50 shadow-2xl',
  };

  return (
    <div className={`rounded-xl p-6 transition-all duration-300 hover:shadow-2xl ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-[#aaccff] to-[#88aaff] text-[#020617] hover:shadow-lg hover:shadow-[#aaccff]/40 hover:scale-105',
    secondary: 'bg-[#1f2937] text-[#aaccff] border border-[#2c50ab] hover:bg-[#2c3947] hover:border-[#88aaff]',
    danger: 'bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white hover:shadow-lg hover:shadow-red-500/40 hover:scale-105',
    ghost: 'text-[#88aaff] hover:bg-[#1f2937] hover:text-[#aaccff]',
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Section = ({ title, subtitle = '', children, className = '' }) => (
  <div className={`mb-8 ${className}`}>
    <div className="mb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ddeeff] to-[#aaccff] bg-clip-text text-transparent mb-1">
        {title}
      </h2>
      {subtitle && <p className="text-[#88aaff] text-sm">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export const CardGrid = ({ children, className = '', cols = 3 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6 ${className}`}>
    {children}
  </div>
);

export const StatCard = ({ title, value, icon = '', trend = null, trendUp = true }) => (
  <Card variant="highlighted">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-4xl">{icon}</div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            trendUp 
              ? 'bg-green-900/50 text-green-300' 
              : 'bg-red-900/50 text-red-300'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}%
          </span>
        )}
      </div>
      <div>
        <h3 className="text-[#88aaff] text-sm font-medium uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-[#ddeeff] mt-1">{value}</p>
      </div>
    </div>
  </Card>
);

export const ProgressBar = ({ label, value, max = 100, color = 'from-[#aaccff] to-[#88aaff]' }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[#88aaff] font-medium text-sm">{label}</span>
        <span className="text-[#aaccff] font-bold text-sm">{value}/{max}</span>
      </div>
      <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const TabNav = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex space-x-4 border-b border-[#1f2937] mb-6 overflow-x-auto">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
          activeTab === tab.id
            ? 'border-[#aaccff] text-[#aaccff]'
            : 'border-transparent text-[#88aaff] hover:text-[#ddeeff]'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const InfoBox = ({ icon, title, description, action, actionLabel = 'Learn More' }) => (
  <Card className="border-l-4 border-l-[#aaccff]">
    <div className="flex items-start gap-4">
      <div className="text-3xl mt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="text-[#ddeeff] font-bold mb-1">{title}</h3>
        <p className="text-[#88aaff] text-sm mb-3">{description}</p>
        {action && (
          <Button onClick={action} variant="ghost" className="text-xs">
            {actionLabel} →
          </Button>
        )}
      </div>
    </div>
  </Card>
);
