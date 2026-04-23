import type { PerceptionGapFlag as PerceptionGapFlagType } from "../../types";
import { fmt } from "../../utils/scoring";

interface PerceptionGapFlagProps {
  flag: PerceptionGapFlagType;
}

export function PerceptionGapFlag({ flag }: PerceptionGapFlagProps) {
  return (
    <article className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-amber-950">
            {flag.competency_name}
          </p>
          <p className="mt-1 text-xs text-amber-800">
            Self score is {fmt(flag.gap)} points above peer average.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-amber-900 ring-1 ring-amber-300">
          +{fmt(flag.gap)}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-white/70 px-3 py-2 text-amber-950 ring-1 ring-amber-100">
          <span className="block text-amber-700">Self</span>
          <span className="font-semibold tabular-nums">{fmt(flag.self_score)}</span>
        </div>
        <div className="rounded-md bg-white/70 px-3 py-2 text-amber-950 ring-1 ring-amber-100">
          <span className="block text-amber-700">Peer avg</span>
          <span className="font-semibold tabular-nums">{fmt(flag.peer_avg)}</span>
        </div>
      </div>
    </article>
  );
}
