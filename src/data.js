import * as d3Fetch from "d3-fetch"

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRq1A_i1wvnY0cPdInPbf50cgeiJOPF-B_iEROEzpvrMYM7O_k_Ee3qy8lhLitG60Q_oy2G6961yd_G/pub?output=csv"

const tags = [
  "Anticipating_Climate_Impacts",
  "Comprehensive_Planning_Grid_Modernization",
  "Data_Transparency_or_Visualization",
  "Electric_Vehicles",
  "Energy_Storage",
  "Environmental_Justice",
  "Innovation_and_Clusters",
  "Local-Level_Planning_or_Support",
  "Microgrids",
  "Distributed_Energy_Resources_(DERs)",
  "Technology_or_System_Standards",
  "Workforce_Development",
]

export default function getData() {
  const dataPromise = d3Fetch.csv(URL).then((res) => {
    //console.log(res);
    const data = res.map((row, index) => {
      return {
        id: index,
        tags: tags
          .filter((tagName) => row[tagName])
          .map((tagName) => tagName.split("_").join(" ")),
        activity: {
          title: row.title,
          quote: row.quote,
          //poni: source_1
          source_1: row.source_1,
          vpn_required_1: (row.vpn_required_1) ? 'You required a VPN to access this source' : null,
          source_2: row.source_2,
          vpn_required_2: row.vpn_required_2,
          source_3: row.source_3,
          vpn_required_3: row.vpn_required_3,
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

    console.log("Data", data)
    const speaker = formatSpeaker(data)

    const speaker_name = createAndAssignSpeakerNames(data)

    const type = formatType(data)

    const categories = formatCategories(data)

    const dates = createAndAssignDateObjects(data)
    return {
      data: data,
      categories: categories,
      dates: dates,
      tags: tags.map((tagName) => tagName.split("_").join(" ")),
      speaker: speaker,
      //speaker without title - for dropdown
      speaker_name: speaker_name,
      type: type,
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
