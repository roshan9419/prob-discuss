export class Answer {
    answerId!: string
    questionId!: string
    questionTitle!: string
    userId!: string
    username!: string
    content!: string
    upvotes?: string[]
    totalVotes?: number
    answeredDate!: Date

    toJson() {
        return Object.assign({}, this);
    }
}