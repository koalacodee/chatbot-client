export interface JSendResponse<T> {
  status: "success" | "error" | "fail";
  data?: T;
  message?: string;
  code?: string;
}
