export interface ApiResponse<T = any> {
  code: string | number;
  message: string;
  result?: T;
}
