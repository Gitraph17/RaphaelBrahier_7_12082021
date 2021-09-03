export default {
  methods: {
    dateFormatter(date) {
      const months = ["janvier", "février", "mars","avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
      let day = date.split(' ')[0].split('-')[2];
      let monthNumber = parseInt(date.split(' ')[0].split('-')[1]);
      let month = months[monthNumber - 1];
      let time = date.substr(11, 5);
      return day + ' ' + month + ', ' + time
    }
  }
}
