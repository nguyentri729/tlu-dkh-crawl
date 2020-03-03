var tkb = [
    {
      timeLearn:
        "Từ 14/01/2019 đến 27/01/2019: (1)   Thứ 6 tiết 4,5,6 (LT)Từ 18/02/2019 đến 14/04/2019: (2)   Thứ 6 tiết 4,5,6 (LT)",
      roomLearn: "S&#xE2;n BR 1 GDTC"
    },
    {
      timeLearn:
        "Từ 14/01/2019 đến 27/01/2019: (1)   Thứ 2 tiết 1,2,3 (LT)   Thứ 5 tiết 1,2,3 (LT)Từ 18/02/2019 đến 31/03/2019: (2)   Thứ 2 tiết 1,2,3 (LT)   Thứ 5 tiết 1,2,3 (LT)",
      roomLearn: "[T2] 307 B5<br>[T5] 308 B5"
    },
    {
      timeLearn:
        "Từ 15/04/2019 đến 09/06/2019:   Thứ 3 tiết 10,11,12 (LT)   Thứ 6 tiết 10,11,12 (LT)",
      roomLearn: "307 B5"
    },
    {
      timeLearn:
        "Từ 14/01/2019 đến 27/01/2019: (1)   Thứ 2 tiết 4,5,6 (LT)   Thứ 4 tiết 1,2,3 (LT)Từ 18/02/2019 đến 31/03/2019: (2)   Thứ 2 tiết 4,5,6 (LT)   Thứ 4 tiết 1,2,3 (LT)",
      roomLearn: "[T2] 307 B5<br>[T4] 308 B5"
    },
    {
      timeLearn:
        "Từ 15/04/2019 đến 09/06/2019:   Thứ 3 tiết 1,2 (LT)   Thứ 5 tiết 1,2 (LT)",
      roomLearn: "[T3] 308 B5<br>[T5] 309 B5"
    },
    {
      timeLearn:
        "Từ 15/04/2019 đến 28/04/2019: (1)   Thứ 2 tiết 1,2,3 (LT)   Thứ 4 tiết 1,2,3 (LT)Từ 29/04/2019 đến 05/05/2019: (2)   Thứ 2 tiết 1,2,3 (LT)   Thứ 4 tiết 1,2,3 (LT)   Thứ 7 tiết 1,2,3 (LT)Từ 06/05/2019 đến 12/05/2019: (3)   Thứ 2 tiết 1,2,3 (LT)   Thứ 4 tiết 1,2,3 (LT)   Thứ 7 tiết 1,2,3 (LT)Từ 13/05/2019 đến 09/06/2019: (4)   Thứ 2 tiết 1,2,3 (LT)   Thứ 4 tiết 1,2,3 (LT)",
      roomLearn:
        "<b>(1,4)</b><br>[T2] 309 B5<br>[T4] 308 B5<br><b>(2)</b><br>[T2] 309 B5<br>[T4] 308 B5<br>[T7] 327 A2<br><b>(3)</b><br>[T2] 309 B5<br>[T4] 308 B5<br>[T7] 347 A3"
    }
  ];
  
  //fetch regex
  
  var timeLearn =
    "Từ 15/04/2019 đến 28/04/2019: (1)   Thứ 2 tiết 1,2,3 (LT)   Thứ 4 tiết 1,2,3 (LT)Từ 29/04/2019 đến 05/05/2019: (2)   Thứ 2 tiết 1,2,3 (LT)   Thứ 4 tiết 1,2,3 (LT)   Thứ 7 tiết 1,2,3 (LT)Từ 06/05/2019 đến 12/05/2019: (3)   Thứ 2 tiết 1,2,3 (LT)   Thứ 4 tiết 1,2,3 (LT)   Thứ 7 tiết 1,2,3 (LT)Từ 13/05/2019 đến 09/06/2019: (4)   Thứ 2 tiết 1,2,3 (LT)   Thứ 4 tiết 1,2,3 (LT)";
  
  const lessionRegex = /(Thứ ([2-9]) tiết (.*?) )/gm;
  const timeRegex = /( ([0-9/]*) đến ([0-9/]*):( \([1-9]\)){0,}.*)/gm;
  const roomRegex = /(\[T([2-7])\] (.*)){1,}/gm;
  var timeLearn = timeLearn.split("Từ");
  
  var roomStr ="<b>(1,4)</b><br>[T2] 309 B5<br>[T4] 308 B5<br><b>(2)</b><br>[T2] 309 B5<br>[T4] 308 B5<br>[T7] 327 A2<br><b>(3)</b><br>[T2] 309 B5<br>[T4] 308 B5<br>[T7] 347 A3"
  
  // while ((r = roomRegex.exec(roomLearn)) !== null) {
  //    console.log(r)
  // }
  
  for (let i = 0; i < timeLearn.length; i++) {
    var index = 0;
    var learnObj = {};
    while ((n = timeRegex.exec(timeLearn[i])) !== null) {
      //check index of days
      if (n[4]) {
        index = n[4].substr(2, n[4].length - 3);
      }
      if (roomStr.search("</b>") >= 0) {
        roomArr = roomStr.split("<br>");
        console.log(roomArr)
        var indexForJ = [];
        for (let j = 0; j < roomArr.length; j++) {
          //console.log(roomLearn[j])
          //Khong tim thay
          let str = roomArr[j];
          if (str.search("<b>") >= 0) {
            indexForJ = str.substr(4, str.length - 9).split(",");
          }
          /*
              Nhet ham kiem tra vao day ne !!!
           */
          if (
           indexForJ.includes(index) || indexForJ.length == 0 || index == 0
          ) {
             //console.log('kiem tra index for ok !!!')
            var roomLearn = [];
            roomArr[j] = roomArr[j].replace('<br>', '')
            while ((r = roomRegex.exec(roomArr[j])) !== null) {
              console.log(r)
              roomLearn.push({
                dayOfWeek: r[2],
                room: r[3]
              });
            }
            learnObj.roomLearn = roomLearn
          }
        }
      }
      learnObj.timeStart = n[2];
      learnObj.timeEnd = n[3];
      //start fetch time learn
      learnObj.timeLearn = [];
      //Xử lý lession
      while ((l = lessionRegex.exec(n.input)) !== null) {
        learnObj.timeLearn.push({
          dayOfWeek: l[2],
          lesson: l[3]
        });
      }
      //Xử lý room
      //Trường hợp 1
      
      
    }
    console.log(learnObj);
  }
  //Xử lý room
  