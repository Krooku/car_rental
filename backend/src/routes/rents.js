const Rent = require('../models/Rent')
const { deleteFromCarList } = require('../services/reminder')

module.exports.createRent = async (req, res) => {
    const userIdStart = req.session.user.id
    const carId = req.params?.carId || req.body?.carId
    console.log(carId)
    const { name, startDate, endDate, days } = req.body

    if (!endDate) endDate = null

    if (!name || !startDate || !days) {
      return res.status(400).json({
        message: 'Incomplete request'
      })
    }
    const rent = new Rent({ userIdStart, carId, name, startDate, endDate, days })

    try {
        await Car.findOneAndUpdate({
            _id: carId
        }, {
            rentId: rent._id
        }, {
            new: false
        }).exec()
        await rent.save()
        res.status(200).json(rent)

    } catch(err) {
        res.status(400).json({
            err
        })
    }
}

module.exports.extandRent = async (req, res) => {
    const carId = req.params
    const { endDate } = req.body

    const rent = await Rent.findOneAndUpdate({carId: carId, status: 'W trakcie'},
        {
            endDate: endDate
        },
        { new: true }
        ).exec()

        if (!rent) {
            res.status(400).json({
                message: 'Errand does not exist or no permission'
            })
        }
        // possible to remaind about inc end of rent time
        deleteFromCarList(carId)

        res.status(200).json(rent)
}
// change things from reminder to Rent Model file to function beforeUpdate/beforeSave
module.exports.finishRent = async (req, res) => {
    const carId = req.params

    const rent = await Rent.findOneAndUpdate({carId: carId, status: 'W trakcie'},
        {
            status: 'Zakończone'
        },
        { new: true }
        ).exec()

        if (!rent) {
            res.status(400).json({
                message: 'Errand does not exist or no permission'
            })
        }
        deleteFromCarList(carId)

        res.status(200).json(rent)
}

module.exports.listRents = async (req, res) => {
    const type = req.params
    let filter = {}
    if (type === 'active') filter = { status: 'W trakcie' }

    await Rent.find(filter).then(rents => {
        res.status(200).json(rents)
    }).catch(err => {
        res.status(500).json({
            message: 'Error with database'
        })
    })
}