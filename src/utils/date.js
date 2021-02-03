export const oneYearBefore = () => {
    return new Date(new Date().setFullYear(new Date().getFullYear() - 1))
}