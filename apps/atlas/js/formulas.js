export function sub(text) {
  return `<sub>${text}</sub>`;
}

export function sup(text) {
  return `<sup>${text}</sup>`;
}

export function formula(html) {
  return `<span class="math-token">${html}</span>`;
}

export function mathHtml(html) {
  return `<span class="math-token">${html}</span>`;
}

export function theta() {
  return mathHtml('&theta;');
}

export function bEntry(row, col) {
  return mathHtml(`b${sub(`${row}${col}`)}(&theta;)`);
}

export function epsilon(label) {
  return mathHtml(`&epsilon;${sub(label)}`);
}

export function stripMathTags(html) {
  return String(html)
    .replace(/<[^>]*>/g, '')
    .replace(/&theta;/g, 'theta')
    .replace(/&epsilon;/g, 'epsilon')
    .replace(/&Sigma;/g, 'Sigma')
    .replace(/&Psi;/g, 'Psi')
    .replace(/&Phi;/g, 'Phi');
}

export function equation(label, html, note = '') {
  return `
    <div class="math-card">
      <span class="math-card__label">${label}</span>
      <div class="math-card__formula">${html}</div>
      ${note ? `<p class="math-card__note">${note}</p>` : ''}
    </div>`;
}

export function matrixHtml(matrix, label = 'B(&theta;)', options = {}) {
  const labelHtml = options.labelHtml ?? label;
  const ariaLabel = stripMathTags(labelHtml);
  const lhsHtml = options.lhsHtml ?? mathHtml('B(&theta;)');
  const rows = matrix
    .map(
      (row) => `
        <tr>${row.map((value) => `<td>${Number(value).toFixed(options.digits ?? 3)}</td>`).join('')}</tr>`
    )
    .join('');

  return `
    <div class="matrix-readout matrix-readout--explained">
      <span class="matrix-readout__label">${labelHtml}</span>
      <div class="matrix-readout__equation">
        <span class="matrix-readout__lhs">${lhsHtml} =</span>
        <span class="matrix-shell" role="img" aria-label="${ariaLabel}">
          <span class="matrix-shell__bracket matrix-shell__bracket--left" aria-hidden="true"></span>
          <table aria-hidden="true">
            <tbody>${rows}</tbody>
          </table>
          <span class="matrix-shell__bracket matrix-shell__bracket--right" aria-hidden="true"></span>
        </span>
      </div>
    </div>`;
}

export function structuralMatrixEquation() {
  return equation(
    'SVAR mixing equation',
    `
      <span class="matrix-eq">
        <span class="matrix-bracket"><span>u${sub('rate,t')}</span><span>u${sub('S&P,t')}</span></span>
        <span>=</span>
        <span class="matrix-bracket"><span>b${sub('11')}</span><span>b${sub('12')}</span><span>b${sub('21')}</span><span>b${sub('22')}</span></span>
        <span class="matrix-bracket"><span>&epsilon;${sub('policy,t')}</span><span>&epsilon;${sub('stock,t')}</span></span>
      </span>
    `,
    'The unknown matrix B0 says how the two structural shocks are mixed into the two reduced-form VAR residuals.'
  );
}

export function expandedSvarEquation() {
  return equation(
    'Bivariate version',
    `
      <span class="equation-stack-inline">
        <span>u${sub('rate,t')} = b${sub('11')}&epsilon;${sub('policy,t')} + b${sub('12')}&epsilon;${sub('stock,t')}</span>
        <span>u${sub('S&P,t')} = b${sub('21')}&epsilon;${sub('policy,t')} + b${sub('22')}&epsilon;${sub('stock,t')}</span>
      </span>
    `,
    `Recovering the structural story means estimating B0 and then computing &epsilon;${sub('t')} = B0${sup('-1')}u${sub('t')}.`
  );
}

export function rotationDerivation() {
  return equation(
    'Why every rotation stays uncorrelated',
    `
      <span class="equation-stack-inline">
        <span>&Sigma;${sub('u')} = P P'</span>
        <span>B(&theta;) = P R(&theta;), with R(&theta;)R(&theta;)' = I</span>
        <span>B(&theta;)B(&theta;)' = P R(&theta;)R(&theta;)' P' = &Sigma;${sub('u')}</span>
        <span>e${sub('t')}(&theta;) = B(&theta;)${sup('-1')}u${sub('t')}</span>
      </span>
    `,
    'The rotation changes the candidate shock interpretation, but it preserves the covariance fit. That is the identification problem.'
  );
}
