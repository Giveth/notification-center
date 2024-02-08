import internal from "stream";

export interface OrttoAdapterInterface {
  callOrttoActivity (data: any): Promise<void>
}
