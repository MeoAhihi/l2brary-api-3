export interface HttpResponse<T = any> {
  success?: boolean;
  code?: string;
  httpCode?: number;
  message?: string;
  data?: T;
}
