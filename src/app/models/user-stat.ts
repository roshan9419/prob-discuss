export class UserStat {
    userId!: string
    username!: string
    questions?: number
    answers?: number

    toJson() {
        return Object.assign({}, this);
    }
}