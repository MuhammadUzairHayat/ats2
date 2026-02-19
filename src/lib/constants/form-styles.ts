// Common CSS classes for form elements to ensure consistency
export const FORM_STYLES = {
  // Base input styles
  input: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400",

  // Label styles
  label: "block text-sm font-medium text-gray-700 mb-2.5",

  // Section heading styles
  sectionHeading: "text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2",

  // Form container styles
  formContainer: "bg-white rounded-2xl border border-gray-100 overflow-hidden",

  // Form header styles
  formHeader: "bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200",

  // Form content styles
  formContent: "p-8",

  // Form actions styles
  formActions: "px-8 py-6 bg-gray-50 border-t border-gray-200",

  // Button styles
  primaryButton: "inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium",

  secondaryButton: "inline-flex cursor-pointer items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 font-medium text-center",

  // Icon container styles
  iconContainer: "p-2 bg-blue-100 rounded-lg",

  // Error text styles
  errorText: "text-red-500 text-sm mt-2",

  // Grid layouts
  gridTwoColumns: "grid grid-cols-1 gap-8 sm:grid-cols-2",
  gridSixColumns: "grid grid-cols-1 gap-8 sm:grid-cols-6",
} as const;