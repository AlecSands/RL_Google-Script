// parse CSVs into google sheet
function myFunction() {
  // create alphabet used for selecting sheet ranges
  let alphClassic = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let alph = [...alphClassic];
  for(m=0; m<alphClassic.length; m++) {
    let newVal = 'A' + alphClassic[m];
    alph.push(newVal);
  }

  // connect to the ballchasing API
  let APIToken = "nope :)";
  let infoStuff = {
    method:"GET",
    headers:{
         Authorization:APIToken
    },
    muteHttpExceptions:true
  }
  let response = UrlFetchApp.fetch("https://ballchasing.com/api/groups/the-bros-2020-07-05test-j8ctds1c7w", infoStuff);

  // parse the response data and select only us
  response = JSON.parse(response);
  let us = [];
  for (k=0; k<response.players.length; k++) {
    if (response.players[k].name == "Reg Dunlop" || response.players[k].name == "Thidwick" || response.players[k].name == "bobthebuilder") {
      us.push(response.players[k])
    }
  }

//  let mergedObj = us[0];
//
////  Logger.log(us[0]["platform"]);
//
//  // function to return value from object given an array of nested keys
//  function findVal (objX, keysArr) {
//    let value = keysArr.reduce((accumulator, currentVal) => {return accumulator[currentVal]}, objX);
//    return value;
//  }
//
//  function combinedVal (obj1, obj2, obj3, keysArr) {
//    Logger.log(keysArr);
//    let newArr = [];
//    let newVal = findVal(obj1, keysArr);
//    newArr.push(newVal);
//    newVal = findVal(obj2, keysArr);
//    newArr.push(newVal);
//    newVal = findVal(obj3, keysArr);
//    newArr.push(newVal);
//    return newArr;
//  }
//
//  function assignVal(objX, keysArr, newVal) {
//
//    if(keysArr.length == 1) {
//      objX[keysArr[0]] = newVal;
//    } else if (keysArr.length == 2) {
//      objX[keysArr[0]][keysArr[1]] = newVal;
//    } else if (keysArr.length == 3) {
//      objX[keysArr[0]][keysArr[1]][keysArr[2]] = newVal;
//    } else if (keysArr.length == 4) {
//      objX[keysArr[0]][keysArr[1]][keysArr[2]][keysArr[3]] = newVal;
//    } else {
//      Logger.log('something is wrong')
//    }
//  }
//
//  // merge data into a single object
//  function objectMerger (obA, depth, keys) {
//    Logger.log("objectMerger called with: " + keys);
//    for (const [key, value] of Object.entries(obA)) {
//      Logger.log("keys: " + keys);
//      if (value instanceof Object == false && keys.length == 0) {
//        let newVal = [];
//        newVal.push(us[0][key]);
//        newVal.push(us[1][key]);
//        newVal.push(us[2][key]);
//        mergedObj[key] = newVal;
//      } else if (value instanceof Object == false && keys.length > 0) {
//        Logger.log(key + ': ' + value);
//        Logger.log(keys);
//        let newVal = [];
//        let newKeys = [...keys, key];
//        newVal = combinedVal(us[0], us[1], us[2], newKeys);
//        assignVal(mergedObj, newKeys, newVal);
//      } else {
//        Logger.log("about to call merger: " + keys);
//        let someNewKeys = keys;
//        someNewKeys.push(key);
//        objectMerger(value, depth+1, someNewKeys)
//      }
//    }
//  }
//
//  objectMerger(mergedObj, 0, []);
//
//  Logger.log(mergedObj);

  // placeholder arrays to be used when appending data
  let columnHeaders = [];
  let dataRows = [];

  // get spreadsheet and define styles
  let spreadsheet = SpreadsheetApp.openById("11SC9xlRzK1E_8ex40RsWYIl89cRMyluMe2vjjrFp43E");
  let sheet = spreadsheet.getSheets()[0];
//  let sheet2 = spreadsheet.getSheets()[0];
  let style = SpreadsheetApp.newTextStyle()
        .setBold(true)
        .build();
  let styleBody = SpreadsheetApp.newTextStyle()
        .setBold(false)
        .build();

  // recursive function which appends data to  spreadsheet 1
  function objectParser (b, name, previousKey) {
    let currentRowHeaders = [];
    let currentRowData = [];
    let rowHeading = [name];

    // loop through each key and then do a recursive check for base case
    for (const [key, value] of Object.entries(b)) {
      if (previousKey) {
        columnHeaders.push(previousKey + "." + key);
      } else {
        columnHeaders.push(key);
      }

      if (value instanceof Object == false) {
        dataRows.push(value);
        currentRowData.push(value);

        if (previousKey) {
          currentRowHeaders.push(previousKey + "_" + key);
        } else {
          currentRowHeaders.push(key);
        }
      } else {
        dataRows.push(" ")
        objectParser(value, key, name);
      }
    }

    // check if there is data to be added and then added it
    if (currentRowHeaders.length > 0) {
//      sheet2.insertRows(1,2);
      Logger.log(currentRowHeaders.length-1);
      Logger.log("A1:" + alph[currentRowHeaders.length-1] + "2")
//      let range = sheet2.getRange("A1:" + alph[currentRowHeaders.length-1] + "2");
//      range.setValues([currentRowHeaders, currentRowData]);
//      range.setTextStyle(styleBody);
    }

    // add section heading
//    sheet2.insertRows(1,1);
//    let range2 = sheet2.getRange("A1:A1");
//    range2.setValues([rowHeading]);
//    range2.setTextStyle(style);

  }


  // run and append new rows as needed
  objectParser(us[0], 'Player');
  sheet.appendRow(columnHeaders);
  sheet.appendRow(dataRows);
  dataRows = [];
  objectParser(us[1], 'Player');
  sheet.appendRow(dataRows);
  dataRows = [];
  objectParser(us[2], 'Player');
  sheet.appendRow(dataRows);
}
