export type ActionErrors<T> = Partial<Record<keyof T, string>>;
export interface JsonResponse {
  success: boolean;
  field?: Record<string, string>;
}
export interface Snackbar {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  key?: string;
  close?: boolean;
}
