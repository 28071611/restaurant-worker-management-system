/**
 * Indian Rupee Formatting Utilities
 * Properly formats amounts in Indian Rupees with lakhs, crores, etc.
 */

/**
 * Format amount in Indian Rupees with proper Indian number formatting
 * @param {number} amount - The amount to format
 * @returns {string} Formatted Indian Rupee string
 */
export const formatIndianRupees = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  // Handle very large numbers (crores and above)
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  
  // Handle lakhs
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  
  // For smaller amounts, use proper Indian formatting
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format amount in Indian Rupees with decimal precision
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted Indian Rupee string with decimals
 */
export const formatIndianRupeesWithDecimals = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `₹0.00`;
  }

  const roundedAmount = amount.toFixed(decimals);
  
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(decimals)} Cr`;
  }
  
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(decimals)} L`;
  }
  
  return `₹${parseFloat(roundedAmount).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

/**
 * Format salary in Indian Rupees with monthly/yearly context
 * @param {number} salary - The salary amount
 * @param {string} period - 'monthly' or 'yearly'
 * @returns {string} Formatted salary with period
 */
export const formatSalary = (salary, period = 'monthly') => {
  const formattedAmount = formatIndianRupees(salary);
  const periodText = period === 'yearly' ? '/year' : '/month';
  return `${formattedAmount}${periodText}`;
};

/**
 * Calculate and format yearly salary from monthly
 * @param {number} monthlySalary - Monthly salary amount
 * @returns {string} Formatted yearly salary
 */
export const formatYearlySalary = (monthlySalary) => {
  const yearlySalary = monthlySalary * 12;
  return formatSalary(yearlySalary, 'yearly');
};

/**
 * Format bonus amount in Indian Rupees
 * @param {number} bonus - Bonus amount
 * @returns {string} Formatted bonus
 */
export const formatBonus = (bonus) => {
  return `Bonus: ${formatIndianRupees(bonus)}`;
};

/**
 * Format total payroll amount
 * @param {number} totalPayroll - Total payroll amount
 * @returns {string} Formatted total payroll
 */
export const formatTotalPayroll = (totalPayroll) => {
  return `Total Payroll: ${formatIndianRupees(totalPayroll)}`;
};

/**
 * Format average salary with context
 * @param {number} avgSalary - Average salary amount
 * @returns {string} Formatted average salary
 */
export const formatAverageSalary = (avgSalary) => {
  return `Average Salary: ${formatIndianRupees(avgSalary)}`;
};

/**
 * Parse Indian Rupee string back to number
 * @param {string} rupeeString - The rupee string to parse
 * @returns {number} Parsed number
 */
export const parseIndianRupees = (rupeeString) => {
  if (!rupeeString) return 0;
  
  // Remove ₹ symbol and commas
  const cleanString = rupeeString.replace(/[₹,]/g, '');
  
  // Handle Cr (crores)
  if (cleanString.includes('Cr')) {
    const number = parseFloat(cleanString.replace('Cr', '').trim());
    return number * 10000000;
  }
  
  // Handle L (lakhs)
  if (cleanString.includes('L')) {
    const number = parseFloat(cleanString.replace('L', '').trim());
    return number * 100000;
  }
  
  return parseFloat(cleanString) || 0;
};

/**
 * Get Indian currency symbol
 * @returns {string} Indian Rupee symbol
 */
export const getRupeeSymbol = () => {
  return '₹';
};

/**
 * Format amount in words (Indian system)
 * @param {number} amount - Amount to convert to words
 * @returns {string} Amount in Indian words
 */
export const formatIndianRupeesInWords = (amount) => {
  if (amount === 0) return 'Zero Rupees';
  
  // This is a simplified version - you can expand it for full conversion
  let words = '';
  
  if (amount >= 10000000) {
    const crores = Math.floor(amount / 10000000);
    words = `${crores} Crore`;
    amount = amount % 10000000;
  }
  
  if (amount >= 100000) {
    const lakhs = Math.floor(amount / 100000);
    words += words ? ` ${lakhs} Lakh` : `${lakhs} Lakh`;
    amount = amount % 100000;
  }
  
  if (amount >= 1000) {
    const thousands = Math.floor(amount / 1000);
    words += words ? ` ${thousands} Thousand` : `${thousands} Thousand`;
    amount = amount % 1000;
  }
  
  if (amount > 0) {
    words += words ? ` ${amount}` : `${amount}`;
  }
  
  return `${words} Rupees`;
};

// Export all functions as a combined object for convenience
export const CurrencyUtils = {
  formatIndianRupees,
  formatIndianRupeesWithDecimals,
  formatSalary,
  formatYearlySalary,
  formatBonus,
  formatTotalPayroll,
  formatAverageSalary,
  parseIndianRupees,
  getRupeeSymbol,
  formatIndianRupeesInWords
};

export default CurrencyUtils;
