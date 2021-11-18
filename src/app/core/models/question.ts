export class Question {
    questionId!: string
    userId!: string
    username!: string
    title!: string
    content!: string
    tags?: string[]
    imgPaths?: string[]
    upvotes?: string[]
    acceptedAnsId?: string
    status!: string
    askedDate!: Date

    toJson() {
        return Object.assign({}, this);
    }
}