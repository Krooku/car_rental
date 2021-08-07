let checkedCars = []

/**
 * @param {string} carId
 */
 function findInCheckedCarList (carId) {
    if (checkedCars) { // checkedCars.find(carId)
        return true
    }
    return false

 }

/**
 * @param {string} carId
 */
function deleteFromCarList (carId) {

    return false
}

/**
 * @param {string} carId
 */
 function addToCarList (carId) {
    if (!findInCheckedCarList(carId)) {
        checkedCars.push(carId)
        return true
    }
    return false
}

 module.exports = {
    findInCheckedCarList,
    deleteFromCarList,
    addToCarList
 }