/** Representa um valor monetário imutável e evita cálculos com ponto flutuante. */
export class Money {
  private constructor(readonly amountInCents: number) {}

  static fromCents(amountInCents: number): Money {
    if (!Number.isInteger(amountInCents) || amountInCents < 0) {
      throw new Error('O valor deve ser um inteiro positivo em centavos.')
    }
    return new Money(amountInCents)
  }

  get cents(): number {
    return this.amountInCents
  }

  format(options?: { hideCents?: boolean }): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: options?.hideCents ? 0 : 2
    }).format(this.amountInCents / 100)
  }
}
