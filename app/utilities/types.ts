export type ActionErrors<T> = Partial<Record<keyof T, string>>;
export interface JsonResponse {
  success: boolean;
  message: string;
  field?: Record<string, string>;
}
export interface Notification {
  title: string;
  description: string;
  type?: "success" | "error" | "warning" | "info";
}
