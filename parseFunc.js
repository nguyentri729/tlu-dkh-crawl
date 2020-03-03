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
    studentMarkFormated[index] = {
      charMark,
      mark,
      subject: {
        subjectCode,
        subjectName,
        numberOfCredit
      },
      semester,
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
    };
    //delete null object
    if (studentMarkFormated[index] == null) {
      delete studentMarkFormated[index];
    }
  });

  //Get mark of year
  let markYearTable = $("#grdResult tbody tr td");
  //console.log(markYearTable.length)
  let markYear = [];
  let index = 0;
  let markYearFor = [];
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
  return {
    markYear,
    studentMarkFormated
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
          dayOfWeek: l[2],
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
                dayOfWeek: r[2],
                room: r[3]
              });

              // learnObj.roomLearn.push();
            }
            if (cac.length == 0) {
              learnObj.roomLearn = {
                dayOfWeek: 0,
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
module.exports = {
  parseInputForm,
  parseStudentMark,
  parseStudentTimeTable,
  formatTimeLearn
};
