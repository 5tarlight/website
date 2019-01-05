module.exports = () => {
  let id = ""
  for(let index = 0; index < 10; ++index) {
    id += Math.floor(Math.random() * 10)
  }
  return Number(id);
}