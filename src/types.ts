const TYPES = {
  Server: Symbol.for('Server'),
  Controller: Symbol.for('Controller'),
  DBClient: Symbol.for('DBClient'),
  ExpressApplication: Symbol.for('ExpressApplication'),
  BoxService: Symbol.for('BoxService'),
  BoxRepository: Symbol.for('BoxRepository')
};

export default TYPES;
