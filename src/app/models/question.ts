export class Question {
    questionId!: string
    userId!: string
    username!: string
    title!: string
    content!: string
    tags?: string
    imgPath?: string[]
    upvotes?: string[]
    askedDate!: Date

    toJson() {
        return Object.assign({}, this);
    }
}