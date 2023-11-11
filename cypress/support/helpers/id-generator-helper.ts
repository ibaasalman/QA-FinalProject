export default class IdGenerator {
  static genericRandomNumber(maxNumber = 1000000000) {
    // return random id with max range
    return Math.round(maxNumber * Math.random());
  }
}
