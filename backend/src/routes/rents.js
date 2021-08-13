const Rent = require('../models/Rent')
const Car = require('../models/Car')

const { findInCheckedCarList, addToCarList, deleteFromCarList } = require('../services/reminder')

const schedule = require('node-schedule');

const job = schedule.scheduleJob('03 * * * *', async () => { // every hour
  const startToday = new Date()
  let endToday =  new Date()
  endToday.setDate(endToday.getDate() + 1)
  console.log('job schedule1')
  console.log(`${startToday}\n${endToday}`)
  const filter = {
      endDate: {
          $gte: startToday,
          $lt: endToday
      },
      status: 'W trakcie'
  }
  await Rent.find(filter).then(rents => {
    rents.forEach(rent => {
      // send e-mail with the message about expired rent's time
      if (findInCheckedCarList(rent._id)) {
        // sending message
        // add the carId to the checkedList
        addToCarList(rent._id)
      }
      console.log('job schedule2')
      console.log(rent.endDate)
    })
  }).catch(err => {
    console.log(err)
  })
});

module.exports.createRent = async (req, res) => {
    const userIdStart = req.session.user.id
    // const carId = req.params?.carId || req.body?.carId
    // console.log(carId)
    const { carId, name, startDate, endDate, days } = req.body

    console.log(userIdStart)
    console.log(req.body)

    if (!endDate) endDate = null
    if (!name || !startDate) {
      return res.status(400).json({
        message: 'Incomplete request'
      })
    }
    const rent = new Rent({ userIdStart, carId, name, startDate, endDate, days })
    console.log('good')
    try {
        await Car.findOneAndUpdate({
            _id: carId
        }, {
            rentId: rent._id
        }, {
            new: false
        }).exec()
        await rent.save()
        console.log('saved')
        res.status(200).json(rent)

    } catch(err) {
        console.log(err)
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