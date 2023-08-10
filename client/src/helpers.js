export const calcTotal = (array) => {
    let total = 0;
    array.forEach((item) => {
        total += +item.amount
    })
    return total.toFixed(2)
}

export const calcPercent = (amount, budget) => {
    const percent = (+amount/+budget)*100
    return `${percent.toFixed(1)}%`
}

export const sortTableData = (array, { sortBy, direction }) => {
        if (sortBy === "amount" && direction === "ascending") {
            return array.sort((a, b) => {return a.amount - b.amount});
        } else if (sortBy === "amount" && direction === "descending" ) {
            return array.sort((a, b) => {return b.amount - a.amount});
        } else {
        return array.sort((a, b) => { 
            if (a[sortBy] < b[sortBy]) return direction === 'ascending' ? -1 : 1
            if (a[sortBy] > b[sortBy]) return direction === 'ascending' ? 1 : -1
            return 0
        })
    }
}