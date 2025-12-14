import React from 'react';
import { BarChart3 } from 'lucide-react';

const RevenueChart = ({ data, title = 'Revenue Overview' }) => {
  const defaultData = [
    { day: 'Mon', revenue: 18000 },
    { day: 'Tue', revenue: 22000 },
    { day: 'Wed', revenue: 19500 },
    { day: 'Thu', revenue: 25000 },
    { day: 'Fri', revenue: 28000 },
    { day: 'Sat', revenue: 24500 },
    { day: 'Sun', revenue: 20000 },
  ];

  const chartData = data || defaultData;
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / chartData.length);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total: KES {totalRevenue.toLocaleString()} | Avg: KES {avgRevenue.toLocaleString()}
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-nairobi-blue dark:text-blue-400" />
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {chartData.map((item, index) => {
          const percentage = (item.revenue / maxRevenue) * 100;
          const isHighest = item.revenue === maxRevenue;
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-12">
                  {item.day}
                </span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500 ${
                        isHighest
                          ? 'bg-gradient-to-r from-matatu-green to-green-700'
                          : 'bg-gradient-to-r from-nairobi-blue to-blue-700'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 20 && (
                        <span className="text-white text-xs font-semibold">
                          KES {item.revenue.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right w-28">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    KES {item.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(percentage)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-matatu-green to-green-700" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Highest</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-nairobi-blue to-blue-700" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Normal</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
