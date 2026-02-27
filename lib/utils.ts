import { LIMIT_RESULT } from '@/action/constants';
import { SearchParams } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate pre-data
export const prepareQueryInfo = function({ search = '', page = 1 }: SearchParams){
  const searchTerm = search?.trim().toLocaleLowerCase() || "";
  const skip = (page - 1) * LIMIT_RESULT;

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
  return (price / 100).toFixed(2) + ' USD'
}
