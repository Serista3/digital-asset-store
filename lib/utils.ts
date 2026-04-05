import { LIMIT_RESULT } from '@/action/constants';
import { ActionState, ErrorMesg, SearchParams } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create error message
export const errorMessage = function(typeMesg: ErrorMesg, err?: Error){
  if(typeMesg === 'custom' && err) {
    return {
      message: (err as Error).message || "Some thing went wrong",
      success: false,
    };
  }

  return { success: false, message: "Unknown error occurred" };
}

// Show notification
export const showNoti = function(result: ActionState<unknown>){
  if (result.success) {
    toast.success(result.message, { position: 'top-center' });
  } else {
    toast.error(result.message, { position: 'top-center' });
  }
}

// Calculate pre-data
export const prepareBaseQueryInfo = function({ search = '', page = '1' }: SearchParams){
  const searchTerm = search?.trim().toLocaleLowerCase() || "";
  const skip = (Number(page) - 1) * LIMIT_RESULT;

  return {
    searchTerm,
    skip,
    limit: LIMIT_RESULT,
  }
}

export const calTotalPages = function(totalItems: number){
  return Math.ceil(totalItems / LIMIT_RESULT)
}

// Fomatted Date
export const formattedDateToRead = function(date: Date){
  return (
    date.toLocaleString("en-En", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
}

// Formatted Price
export const formattedPrice = function(price: number){
  return (price / 100).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " THB"
}

// Calculate Date Range
export const getDateRange = function(month?: number, year?: number){
  let startDate: Date | undefined = undefined;
  let endDate: Date | undefined = undefined;

  if (year && month) {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 1);
  }

  else if (year) {
    startDate = new Date(year, 0, 1);
    endDate = new Date(year + 1, 0, 1);
  }

  else if (month) {
    const curYear = new Date().getFullYear()

    startDate = new Date(curYear, month - 1, 1);
    endDate = new Date(curYear, month, 1);
  }

  return { startDate, endDate }
}
