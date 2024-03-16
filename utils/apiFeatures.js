class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObject = { ...this.queryString };
    const fields = ['page', 'sort', 'limit', 'fields'];
    fields.forEach((item) => delete queryObject[item]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const newQuery = JSON.parse(queryStr);
    this.query = this.query.find(newQuery);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsBy);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate(){
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    this.query = this.query.skip((page - 1) * limit).limit(limit);
    return this
  }
}

module.exports=APIFeatures;
