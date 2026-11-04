'use client';

import ConsultFlow from './ConsultFlow';

/** Il questionario dentro la pagina /consulenza-gratuita: una lastra di vetro. */
export default function ConsultInline() {
  return (
    <ConsultFlow variant="inline">
      {({ header, body, footer }) => (
        <div data-flow-root className="slab k-ios scroll-mt-24 overflow-hidden !rounded-[30px] !bg-cream/90 shadow-[var(--shadow-sage-l)]">
          <div className="pt-3">{header}</div>
          {body}
          <div className="[&>div]:!bg-transparent [&>div]:!pb-5 [&>div]:!backdrop-blur-none">{footer}</div>
        </div>
      )}
    </ConsultFlow>
  );
}
