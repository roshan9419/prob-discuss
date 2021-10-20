export class Answer {
    answerId!: string
    questionId!: string
    userId!: string
    username!: string
    content!: string
    upvotes?: string[]
    answeredDate!: Date

    toJson() {
        return Object.assign({}, this);
    }
}