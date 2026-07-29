export interface OrttoAdapterInterface {
  // Resolves `true` when Ortto accepted the activity/merge, `false` when the
  // Ortto call failed (error is logged, not thrown). Callers that need a
  // confirmed upsert (e.g. the giveth-v6-core#426 contact sync) branch on this
  // instead of assuming success from a resolved promise.
  callOrttoActivity(data: any, microService: string): Promise<boolean>;
}
