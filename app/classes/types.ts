class CardType {
    public code!: string
    public name!: string
    public order!: number

    constructor(code: string, name: string, order: number) {
        this.code = code
        this.name = name
        this.order = order
    }
}

const Types: CardType[] = [
    new CardType('G', 'Grass', 0),
    new CardType('R', 'Fire', 1),
    new CardType('W', 'Water', 2),
    new CardType('L', 'Lightning', 3),
    new CardType('P', 'Psychic', 4),
    new CardType('F', 'Fighting', 5),
    new CardType('D', 'Darkness', 6),
    new CardType('M', 'Metal', 7),
    new CardType('N', 'Dragon', 8),
    new CardType('C', 'Colorless', 9),
    new CardType('T', 'Trainer', 10),
    new CardType('E', 'Special Energy', 11)
]

const GetTypeByCode = (code: string): CardType | undefined =>
    Types.find((x: CardType) => x.code == code)

export { CardType, Types, GetTypeByCode }
