export interface OrttoAdapterInterface {
  callOrttoActivity(data: any, microService: string): Promise<void>;
}
