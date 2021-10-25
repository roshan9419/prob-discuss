export class User {
    userId!: string
    username!: string
    email?: string | null
    photoUrl?: string
    about?: string
    occupation?: string
    githubLink?: string
    registeredDate!: Date

    toJson() {
        return Object.assign({}, this);
    }
}