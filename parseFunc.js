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
  for (let i = 10; i < tr.length - 10; i++) {
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
const formatTimeLearn = (timeLearn, roomLearn) => {
  /* Format 1 */
  const regex = /(Từ ([0-9/]*) đến ([0-9/]*):( \([1-9]\)){0,}.*)/gm;
  //let timeLearn = `Từ 14/01/2019 đến 27/01/2019: (1)   Thứ 2 tiết 4,5,6 (LT)   Thứ 4 tiết 1,2,3 (LT)Từ 18/02/2019 đến 31/03/2019: (2)   Thứ 2 tiết 4,5,6 (LT)   Thứ 4 tiết 1,2,3 (LT)`;
  // var roomLearn = `303-MT A5`;
  timeLearn = timeLearn.replace(")Từ", ")\nTừ");
  learnTable = [];
  const regexRoom = /\[T(\d){1,}\]/gm;
  const regexTime = /(Thứ ([2-9]) tiết (.*?) )/gm;

  roomLearn = roomLearn.split('<br>');
  let roomAndDay = [];
  for (let index = 0; index < roomLearn.length; index++) {
    var str_room = roomLearn[index]
    let str_rp = ''
     let dayOfWeek = ''
     while ((n = regexRoom.exec(str_room)) !== null) {
        if (n.index === regexRoom.lastIndex) {
            regexRoom.lastIndex++;
        }
        str_rp += n[0] + ' '
        dayOfWeek += n[1] + ','
       // console.log(n)
     }
     str_room = str_room.replace(str_rp, '')
     dayOfWeek = dayOfWeek.substring(0, dayOfWeek.length - 1)
     roomAndDay.push({
        dayOfWeek,
        room: str_room
     })
  }
  //RomeAndDay error
  if (roomAndDay.length == 0) {
    roomAndDay.push({
      dayOfWeek: 0,
      room: unescape(roomLearn)
    });
  }  
  
  //Tu ngay bao nhieu den ngay bao  nhieu
  let lession = []
  while ((m = regex.exec(timeLearn)) !== null) {
    lession = []
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    
    while ((t = regexTime.exec(m.input)) !== null) {
      
      if (t.index === regexTime.lastIndex) {
        regexTime.lastIndex++;
      }
      lession.push({
        dayOfWeek: t[2],
        lessions: t[3]
      })
    }
     //rome regular
     learnTable.push({
      startDay: m[2],
      endDay: m[3],
      lession,
      roomAndDay
    });
   // console.log(m)
  }

  return learnTable;
};
module.exports = {
  parseInputForm,
  parseStudentMark,
  parseStudentTimeTable,
  formatTimeLearn
};
