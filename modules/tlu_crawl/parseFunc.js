const _ = require("lodash");
/*
Parse Input of Form
*/

const parseInputForm = $ => {
  let str = "";
  let form = $("form");
  let inputs = form.find("input");
  let data = {};
  inputs.each((i, ele) => {
    $(ele).val() ? (value = $(ele).val()) : (value = "");
    data[$(ele).attr("name")] = value;
    str += $(ele).attr("name") + "=" + value + ";";
  });
  let selects = form.find("select option:selected");

  selects.each((i, elem) => {
    if (
      $(elem)
        .parent()
        .attr("name")
    )
      data[
        $(elem)
          .parent()
          .attr("name")
      ] = $(elem).val();
  });
  //select form

  return data;
};
const parseMarkYear = $ => {
  let markYearTable = $("#grdResult tbody tr td");
  //console.log(markYearTable.length)
  let markYear = [];
  let index = 0;
  var markYearFor = [];
  for (let i = 14; i < markYearTable.length; i++) {
    markYearFor.push(
      $(markYearTable[i])
        .text()
        .trim()
    );
    if ((i + 1) % 14 === 0) {
      index++;
      if (index >= 1) {
        markYear.push({
          semester:
            markYearFor[1] === "Cả Năm" || markYearFor[0] === "Toàn khóa"
              ? markYearFor[0]
              : markYearFor[0] + "_" + markYearFor[1],
          tbtl: markYearFor[4],
          tbc: markYearFor[10]
        });
        markYearFor = [];
      }
    }
  }
  return markYear;
};
/*
Parse Student Mark
*/
const parseStudentMark = ($, semester = {}) => {
  let studentMark = [];
  let trTable = $("#tblStudentMark")
    .find("tbody")
    .find("tr");

  trTable.each((i, elem) => {
    studentMark[i] = [];

    let tdTable = $(elem).find("td");
    tdTable.each((index, td) => {
      return (studentMark[i][index] = $(td).text());
    });
  });
  //delete data of header & footer in table
  delete studentMark[0];
  delete studentMark[studentMark.length - 1];

  //format to same dkhsv.tlu.edu.vn data constructor

  let studentMarkFormated = [];
  studentMark.forEach((marks, index) => {
    let [
      stt,
      subjectCode,
      subjectName,
      numberOfCredit,
      studyTime,
      timeThi,
      rowExam,
      isCounted,
      isAccepted,
      msv,
      markQT,
      markTHI,
      mark,
      charMark
    ] = marks;
    if (mark) {
      studentMarkFormated.push({
        charMark,
        mark,
        subject: {
          subjectCode,
          subjectName,
          numberOfCredit
        },
        details: [
          {
            coeffiecient: 0,
            mark: markQT
          },
          {
            coeffiecient: 0,
            mark: markTHI
          }
        ],
        isAccepted,
        isCounted,
        studyTime,
        timeThi
      });
    }
  });
  return {
    semester,
    data: studentMarkFormated
  };
};
/*
Parse studentTime Table
*/
const parseStudentTimeTable = $ => {
  let tr = $("#gridRegistered tbody tr td");
  /*
    regex time: const regex = /(Từ ([0-9/]*) đến ([0-9/]*): (\([1-9]\))(\s*Thứ ([2-7]*) tiết (.*?) (\(.*?\))){1,}){1,}/gm;
    regex room: (\[T([2-7])\] (.*)){1,}
    */
  let count = 0;
  let table = [];
  //set i = 10 & length-10 to skip header & footer tr
  for (let i = 10; i < tr.length; i++) {
    if (i % 10 == 0 && i != 10) {
      table.push({
        displayName: subjectLearn,
        timetables: formatTimeLearn(timeLearn, roomLearn)
      });
      // console.log(formatTimeLearn(timeLearn, roomLearn))
      count = 0;
    }
    let elementText = $(tr[i]);
    count++;
    count == 2 ? (subjectLearn = elementText.text().trim()) : "";
    count == 4 ? (timeLearn = elementText.text().trim()) : "";
    count == 5 ? (roomLearn = elementText.html().trim()) : "";
  }
  return table;
};
/*
format timeLearn string to object
*/
const formatTimeLearn = (timeLearn, roomStr) => {
  const lessionRegex = /(Thứ ([2-9]) tiết (.*?) )/gm;
  const timeRegex = /( ([0-9/]*) đến ([0-9/]*):( \([1-9]\)){0,}.*)/gm;
  const roomRegex = /(\[T([2-7])\] (.*)){1,}/gm;
  var timeLearn = timeLearn.split("Từ");

  var timetable = [];
  for (let i = 0; i < timeLearn.length; i++) {
    var index = 0;
    var learnObj = {};
    while ((n = timeRegex.exec(timeLearn[i])) !== null) {
      //check index of days
      if (n[4]) {
        index = n[4].substr(2, n[4].length - 3);
      }
      learnObj.timeStart = n[2];
      learnObj.timeEnd = n[3];
      //start fetch time learn
      learnObj.timeLearn = [];
      //lession format
      while ((l = lessionRegex.exec(n.input)) !== null) {
        learnObj.timeLearn.push({
          dayOfWeek: parseInt(l[2]),
          lesson: l[3]
        });
      }
      if (true) {
        roomArr = roomStr.split("<br>");
        var cac = [];
        var indexForJ = [];
        for (let j = 0; j < roomArr.length; j++) {
          //console.log(roomLearn[j])
          //Khong tim thay
          let str = roomArr[j];
          if (str.search("<b>") >= 0) {
            indexForJ = str.substr(4, str.length - 9).split(",");
          }
          //check index and indexforJ
          if (
            indexForJ.includes(index) ||
            indexForJ.length == 0 ||
            index == 0
          ) {
            //console.log('kiem tra index for ok !!!')

            roomArr[j] = roomArr[j].replace("<br>", "");
            while ((r = roomRegex.exec(roomArr[j])) !== null) {
              cac.push({
                dayOfWeek: parseInt(r[2]),
                room: r[3]
              });

              // learnObj.roomLearn.push();
            }
            if (cac.length == 0) {
              learnObj.roomLearn = {
                dayOfWeek: "all",
                room: roomStr
              };
            } else {
              learnObj.roomLearn = cac;
            }
          }
        }
      }
    }
    if (learnObj.timeStart) {
      timetable.push(learnObj);
    }
  }
  /*
    Đoạn bóc tách khá cồng kềnh nên méo hiểu mình code gì luôn :3 chán !!!!
    cơ mà vẫn return đúng là oke dồi :V kaka
  */
  return timetable;
};
/*
  if start = 0, start from now day
  
*/
const sortByDay = (studentTable, options = { limit: 1, start: 0 }) => {
  var dayLearn = [];
  for (let i = 0; i < studentTable.length; i++) {
    const subject = studentTable[i];
    var { displayName } = subject;
    for (let j = 0; j < subject.timetables.length; j++) {
      var { timeStart, timeEnd, timeLearn, roomLearn } = subject.timetables[j];
      timeStart = timeStart.split("/");
      timeEnd = timeEnd.split("/");
      timeStart = new Date(timeStart[2], timeStart[1] - 1, timeStart[0]);
      timeEnd = new Date(timeEnd[2], timeEnd[1] - 1, timeEnd[0]);
      //   if (options.start == 0 && timeEnd > new Date()) {

      // }
      //handle limit day
      // if (options.limit > 0) {
      //   if(timeEnd > timeStart.setDate(timeStart.getMonth() + 1)) {
      //       timeEnd = timeStart.setDate(timeStart.getMonth() + 1)
      //   }
      // }
      var today = new Date();
      var todayMiliseconds = Date.parse(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      ).toString();
      var endMiliseconds = Date.parse(
        new Date(
          today.getFullYear(),
          today.getMonth() + options.limit,
          today.getDate()
        )
      ).toString();
      while (timeStart < timeEnd) {
        var thu = timeStart.getDay() + 1;
        var day = Date.parse(timeStart).toString();
        //Don't import Sunday into list
        if (
          thu == 1 ||
          parseInt(day) < parseInt(todayMiliseconds) ||
          parseInt(day) > parseInt(endMiliseconds)
        ) {
          var newDate = timeStart.setDate(timeStart.getDate() + 1);
          timeStart = new Date(newDate);
          continue;
        }

        var day = Date.parse(timeStart).toString();

        var findDay = _.findIndex(dayLearn, { date: day });

        // info: {
        //   ngay: timeStart.getDate(),
        //   thang: timeStart.getMonth() + 1,
        //   name: timeStart.getFullYear()
        // },
        if (findDay < 0) {
          dayLearn.push({
            date: day,
            thu,
            info: `${timeStart.getDate()}/${timeStart.getMonth()}/${timeStart.getFullYear()}`,
            data: []
          });
        }

        let lessonIndex = _.findIndex(timeLearn, { dayOfWeek: thu });
        let roomIndex = _.findIndex(roomLearn, { dayOfWeek: thu });

        if (lessonIndex >= 0) {
          //Ngay nay co di hoc
          let { lesson } = timeLearn[lessonIndex];
          if (roomIndex == -1) {
            var { room } = roomLearn;
          } else {
            var { room } = roomLearn[roomIndex];
          }
          // timeStart

          //find in day
          let dayIndex = _.findIndex(dayLearn, { date: day });
          if (dayIndex >= 0) {
            let lastObject = dayLearn[dayIndex]["data"];
            let newObject = {
              displayName,
              lesson,
              room
            };
            //sort object
            let sortObject = _.sortBy([...lastObject, newObject], ["lesson"]);
            dayLearn[dayIndex]["data"] = sortObject;
          } else {
            dayLearn.push({
              date: day,
              thu,
              data: [
                {
                  displayName,
                  lesson,
                  room
                }
              ]
            });
          }

          //console.log(Date.parse(timeStart), lesson, room)
        }
        var newDate = timeStart.setDate(timeStart.getDate() + 1);
        timeStart = new Date(newDate);
      }
    }
  }
  // var rt = dayLearn.sort()

  return _.sortBy(dayLearn, ["date"]);
};

/*
  parse student example
*/
const parseViewExam = $ => {
  let listExam = $("#tblCourseList tbody tr");
  let exam = [];
  for (let i = 0; i < listExam.length; i++) {
    const list = $(listExam[i]);
    //remove header && footer
    if (i > 0 && i !== listExam.length - 1) {
      let x = $(list)
        .find("td")
        .nextAll();
      exam.push({
        examName: $(x[1]).text().trim(),
        examDay: $(x[3]).text().trim(),
        examHour: $(x[4]).text().trim(),
        examType: $(x[5]).text().trim(),
        code: $(x[6]).text().trim(),
        examRoom: $(x[7]).text().trim(),
        examNote: $(x[8]).text().trim()
      });
    }
  }

  return exam;
};
module.exports = {
  parseInputForm,
  parseStudentMark,
  parseMarkYear,
  parseStudentTimeTable,
  formatTimeLearn,
  sortByDay,
  parseViewExam
};
