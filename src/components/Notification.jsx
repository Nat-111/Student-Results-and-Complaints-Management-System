import React from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Notification = ({ type = 'info', title, message, time }) => {
  const icons = {
    info: <Info size={18} className="text-blue-500" />,
    success: <CheckCircle size={18} className="text-green-500" />,
    warning: <AlertTriangle size={18} className="text-yellow-500" />,
    error: <XCircle size={18} className="text-red-500" />,
  };

  const colors = {
    info: 'bg-blue-50 border-blue-100',
    success: 'bg-green-50 border-green-100',
    warning: 'bg-yellow-50 border-yellow-100',
    error: 'bg-red-50 border-red-100',
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[type]} flex gap-3 animate-in fade-in slide-in-from-right-5 duration-300`}>
      <div className="shrink-0 mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{message}</p>
        {time && <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase">{time}</p>}
      </div>
    </div>
  );
};

export default Notification;
