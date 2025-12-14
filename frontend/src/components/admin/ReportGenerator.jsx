import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportGenerator = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    reportType: 'revenue',
    dateRange: 'thisMonth',
    startDate: '',
    endDate: '',
    format: 'pdf',
    includeCharts: true,
  });
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { value: 'revenue', label: 'Revenue Report', icon: '💰' },
    { value: 'trips', label: 'Trip Analytics', icon: '🚗' },
    { value: 'drivers', label: 'Driver Performance', icon: '👤' },
    { value: 'fleet', label: 'Fleet Utilization', icon: '🚙' },
    { value: 'customers', label: 'Customer Insights', icon: '👥' },
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const formats = [
    { value: 'pdf', label: 'PDF Document', icon: '📄' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: '📊' },
    { value: 'csv', label: 'CSV File', icon: '📋' },
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (formData.dateRange === 'custom' && (!formData.startDate || !formData.endDate)) {
      toast.error('Please select both start and end dates');
      return;
    }

    setGenerating(true);

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (onGenerate) {
        await onGenerate(formData);
      }

      const reportName = reportTypes.find((t) => t.value === formData.reportType)?.label;
      toast.success(`${reportName} generated successfully!`);

      // In real implementation, this would trigger a file download
      console.log('Generating report:', formData);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-nairobi-blue text-white rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Generator</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate comprehensive business reports
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <Filter className="w-4 h-4 inline mr-2" />
            Report Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reportTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.reportType === type.value
                    ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="reportType"
                  value={type.value}
                  checked={formData.reportType === type.value}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="hidden"
                />
                <span className="text-2xl">{type.icon}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date Range
          </label>
          <select
            value={formData.dateRange}
            onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white mb-3"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {formData.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-nairobi-blue dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {formats.map((format) => (
              <label
                key={format.value}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.format === format.value
                    ? 'border-nairobi-blue bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={format.value}
                  checked={formData.format === format.value}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="hidden"
                />
                <span className="text-3xl">{format.icon}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {format.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <input
            type="checkbox"
            id="includeCharts"
            checked={formData.includeCharts}
            onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
            className="w-5 h-5 text-nairobi-blue focus:ring-2 focus:ring-nairobi-blue rounded"
          />
          <label htmlFor="includeCharts" className="flex-1 cursor-pointer">
            <p className="font-semibold text-gray-900 dark:text-white">Include Charts & Graphs</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add visual representations of data in the report
            </p>
          </label>
          <TrendingUp className="w-6 h-6 text-gray-400" />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={generating}
          className="w-full px-6 py-4 bg-nairobi-blue text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          {generating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Generate & Download Report
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportGenerator;
