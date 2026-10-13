/** Serviço de aplicação que persiste favoritos no navegador. */
export class FavoriteService {
  constructor(private readonly storageKey: string, private readonly storage: Storage) {}

  list(): string[] {
    const value = this.storage.getItem(this.storageKey)
    return value ? JSON.parse(value) as string[] : []
  }

  toggle(id: string): string[] {
    const current = this.list()
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    this.storage.setItem(this.storageKey, JSON.stringify(next))
    return next
  }
}
