export interface OrttoAdapterInterface {
  callOrttoActivity(data: any): Promise<void>;
}
