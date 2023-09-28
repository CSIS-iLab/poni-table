import * as d3Fetch from "d3-fetch"

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-_ERImv22VF5VJU8oWN2g9_uQ4LzJr21zOHHtizHHYTuQJvHZHJGaJE6d1DUDifpiPGqmZL4MIbgU/pub?output=csv"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
export default function getData() {
  const dataPromise = d3Fetch.csv(URL).then((res) => {
    const data = res.map((row, index) => {
      return {
        id: index,
        activity: {
          title: row.title,
          quote: row.quote,
          sources: [
            [row.source_1, row.vpn_required_1],
            [row.source_2, row.vpn_required_2],
            [row.source_3, row.vpn_required_3],
          ],
          image_url: row.image_url,
          image_source: row.image_source,
          key_moment: row.key_moment,
        },
        category: row.category,
        category_name: row.category_name,
        speaker: row.speaker,
        speaker_name: "",
        type: row.type,
        //poni: date,
        date_string: row.date,
        date: "",
      }
    })

    const speaker = formatSpeaker(data)

    const speaker_name = createAndAssignSpeakerNames(data)

    const type = formatType(data)

    const categories = formatCategories(data)

    const dates = createAndAssignDateObjects(data)

    return {
      data: data,
      categories: categories,
      dates: dates,
      speaker: speaker,
      //speaker without title - for dropdown
      speaker_name: speaker_name,
      type: type,
      months: months,
    }
  })
  return dataPromise
}

function createAndAssignSpeakerNames(array) {
  let speaker_Name_Array = []

  for (let i = 0; i < array.length; i++) {
    let name = array[i].speaker.split(",")[0]
    if (array[i].speaker != "") {
      array[i].speaker_name = name

      if (!speaker_Name_Array.includes(name)) {
        speaker_Name_Array.push(name)
      }
    }
  }

  return speaker_Name_Array
}

function createAndAssignDateObjects(array) {
  let dates = []
  let date_string = []

  for (let i = 0; i < array.length; i++) {
    let date = array[i].date_string

    let dateObject = new Date(date)
    array[i].date = dateObject

    if (!date_string.includes(array[i].date_string)) {
      date_string.push(array[i].date_string)
      dates.push(dateObject)
    }
  }

  return dates
}

function formatSpeaker(array) {
  return [...new Set(array.map((el) => el.speaker))]
}

function formatType(array) {
  return [...new Set(array.map((el) => el.type))]
}

function formatCategories(array) {
  // return [...new Set(row.map((r) => r.category))].map((category) => {
  //   return {
  //     name: row.find((r) => r.category === category).category_name,
  //     value: row.find((r) => r.category === category).category,
  //   };
  // });

  return [...new Set(array.map((el) => el.category))]
}
