
class DateHelper{
    static addWeeksToDate(dateObj,numberOfWeeks) {
        dateObj.setDate(dateObj.getDate()+ numberOfWeeks * 7);
        return dateObj;
      }
}

module.exports =  {DateHelper}