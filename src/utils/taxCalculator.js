const long = {
    single: {
        first: 40000,
        second: 441450,
    },
    married: {
        first: 80000,
        second: 469050
    }
}

const short = {
    single: {
        first: 9875,
        second: 40125,
        third: 85525,
        fourth: 163300,
        fifth: 207350,
        sixth: 518400,
    },
    married: {
        first: 19750,
        second: 80250,
        third: 171050,
        fourth: 326600,
        fifth: 414700,
        sixth: 622050,
    }
}

export const taxCalculator = ({ term, status, earned }) => {
    if (term === "long") {
        if (status === "single") {
            if (earned < long.single.first) {
                return 0
            }
            if (earned < long.single.second) {
                return earned * 0.15
            }
            return earned * 0.2
        }

        if (status === "married") {
            if (earned < long.married.first) {
                return 0
            }
            if (earned < long.married.second) {
                return earned * 0.15
            }
            return earned * 0.2
        }
    }

    if (term === "short") {
        if (status === "single") {
            if (earned < short.single.first) {
                return 0
            }
            if (earned < short.single.second) {
                return earned * 0.12
            }
            if (earned < short.single.second) {
                return earned * 0.22
            }
            if (earned < short.single.second) {
                return earned * 0.24
            }
            if (earned < short.single.second) {
                return earned * 0.32
            }
            if (earned < short.single.second) {
                return earned * 0.35
            }
            return earned * 0.37
        }

        if (status === "married") {
            if (earned < long.married.first) {
                return 0
            }
            if (earned < short.single.second) {
                return earned * 0.12
            }
            if (earned < short.single.second) {
                return earned * 0.22
            }
            if (earned < short.single.second) {
                return earned * 0.24
            }
            if (earned < short.single.second) {
                return earned * 0.32
            }
            if (earned < short.single.second) {
                return earned * 0.35
            }
            return earned * 0.37
        }
    }
}