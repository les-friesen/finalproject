export const calcTotal = (array) => {
    let total = 0;
    array.forEach((item) => {
        total += +item.amount
    })
    return total.toFixed(2)
}

export const calcPercent = (amount, budget) => {
    const percent = (+amount/+budget)*100
    return `${percent.toFixed(1)}`
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

export const sumArray = (array) => {
    let sum = 0; 
    array.forEach((item) => {
        sum += +item
    })
    return sum ; 
}

// const participants = ["James", "John", "Alecia", "Jesse"]

// const expenses = [ {amount: 12, paidBy: "James", distribution: [0, 4, 4, 4]}, {amount: 22, paidBy: "Alecia", distribution: [4, 6, 6, 6]}]

// //I want a separate total for each participant, i.e. an array of totals.
// //I need one array of Total paid and one of total used. 

// let totalsPaid = []
// let totalsUsed = []

// participants.forEach((participant, index) => {
    
//   const filteredArray =  expenses.filter((expense) => expense.paidBy === participants[index])
  
//   let totalPaid = 0
  
//   filteredArray.forEach((expense) => {
//       totalPaid += expense.amount 
//   })
  
//   totalsPaid.push(totalPaid)
  
//   let totalUsed = 0
  
//   expenses.forEach((expense) => {
//       totalUsed += expense.distribution[index]
//   })
  
//   totalsUsed.push(totalUsed)
// })

// console.log(totalsPaid)
// console.log(totalsUsed)

// let balances = []
// participants.forEach((participant, index) => {
//   let totalPaid = 0
//   expenses.filter((expense) => expense.paidBy === participants[index]).forEach((expense) => {
//       totalPaid += expense.amount 
//   })
//   let totalUsed = 0
//   expenses.forEach((expense) => {
//       let denominator = 0
//       expense.distribution.forEach((number) => {
//           denominator += number 
//       })
//       totalUsed += expense.distribution[index]/denominator*expense.amount
//   })
//   balances.push(totalPaid-totalUsed)
// })