const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
class TourController {
  checkId(req, res, next, val) {
    console.log(`tour co id là :${val}`);
    if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid id',
      });
    }
    next();
  }

  getAllTours(req, res) {
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  }

  getTour(req, res) {
    const id = req.params.id * 1;
    const tour = tours.find((item) => {
      return item.id === id;
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  }

  createTour(req, res) {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = { id: newId, ...req.body };
    tours.push(newTour);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      }
    );
  }

  updateTour(req, res) {
    const tour = tours.find((item) => {
      return item.id === req.params.id * 1;
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: req.body,
      },
    });
  }

  deleteTour(req, res) {
    res.status(204).json({
      status: 'success',
      data: {},
    });
  }
}

module.exports = new TourController();
