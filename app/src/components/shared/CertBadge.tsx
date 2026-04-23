import type { CertificationStatus } from "../../types";
import { CERT_STATUS_COLOR } from "../../types";
import { certLabel } from "../../utils/scoring";

interface CertBadgeProps {
  status: CertificationStatus;
}

export function CertBadge({ status }: CertBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${CERT_STATUS_COLOR[status]}`}
    >
      {certLabel(status)}
    </span>
  );
}
