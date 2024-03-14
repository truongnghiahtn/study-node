const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );
class TourController {
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

    if (tour?.id) {
      res.status(200).json({
        status: 'success',
        data: {
          tour: tour,
        },
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Invalid id',
      });
    }
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
    if (!tour) {
      res.status(404).json({
        status: 'fail',
        message: 'Invalid id',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour: req.body,
      },
    });
  }

  deleteTour(req, res) {
    const tour = tours.find((item) => {
      return item.id === req.params.id * 1;
    });
    if (!tour) {
      res.status(404).json({
        status: 'fail',
        message: 'Invalid id',
      });
    }
    res.status(204).json({
      status: 'success',
      data: {},
    });
  }
}

module.exports= new TourController;
