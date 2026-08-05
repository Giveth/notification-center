// Outcome of an Ortto activity/merge call. `ok` says whether Ortto accepted it;
// `retryable` distinguishes a transient failure (5xx / timeout / network — worth
// retrying) from a permanent one (4xx — a bad payload or unprovisioned
// field/activity that will keep failing until fixed). Callers that need a
// confirmed upsert (the giveth-v6-core#426 contact sync) map these onto HTTP
// statuses (502 vs 4xx) so the caller retries transient failures but not
// permanent ones. `status`/`responseBody` are carried for diagnostics; the
// error itself is logged, never thrown.
export interface OrttoActivityResult {
  ok: boolean;
  retryable: boolean;
  status?: number;
  responseBody?: unknown;
}

export interface CallOrttoActivityOptions {
  // Finite per-request timeout in ms. Only the contact sync passes one (it
  // needs a prompt failure to feed its retry path); other events omit it and
  // keep their previous no-timeout behavior.
  timeoutMs?: number;
}

export interface OrttoAdapterInterface {
  callOrttoActivity(
    data: any,
    microService: string,
    options?: CallOrttoActivityOptions,
  ): Promise<OrttoActivityResult>;
}
