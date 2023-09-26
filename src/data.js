import * as d3Fetch from "d3-fetch";

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRq1A_i1wvnY0cPdInPbf50cgeiJOPF-B_iEROEzpvrMYM7O_k_Ee3qy8lhLitG60Q_oy2G6961yd_G/pub?output=csv";

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
];

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
          //poni: title
          title: row.title,
          //poni: quote
          description: row.quote,
          //poni: source_1
          link: row.source_1,
          vpn_required_1: row.vpn_required_1,
          source_2: row.source_2,
          vpn_required_2: row.vpn_required_2,
          source_3: row.source_3,
          vpn_required_3: row.vpn_required_3,
          image_url: row.image_url,
          image_source: row.image_source,
          key_moment: row.key_moment,
        },
        //poni: category
        state: row.category,
        //poni: category
        state_name: row.category_name,
        //poni: speaker
        authority: row.speaker,
        authority_name: "",
        //poni: type
        type_of_resource: row.type,
        //poni: date,
        date_string: row.date,
        date: "",
      };
    });

    console.log("Data", data);
    const authority = formatAuthority(data);

    const authority_name = createAndAssignAuthorityNames(data);

    const resourceTypes = formatResourceType(data);

    const states = formatStates(data);

    const dates = createAndAssignDateObjects(data);
    return {
      data: data,
      //poni: category
      states: states,
      dates: dates,
      tags: tags.map((tagName) => tagName.split("_").join(" ")),
      //poni: speaker
      authority: authority,
      //speaker without title - for dropdown
      authority_name: authority_name,
      //poni: type
      resourceTypes: resourceTypes,
    };
  });
  return dataPromise;
}

function createAndAssignAuthorityNames(array) {
  let authority_Name_Array = [];

  for (let i = 0; i < array.length; i++) {
    let name = array[i].authority.split(",")[0];
    if (array[i].authority != "") {
      array[i].authority_name = name;

      if (!authority_Name_Array.includes(name)) {
        authority_Name_Array.push(name);
      }
    }
  }

  return authority_Name_Array;
}

function createAndAssignDateObjects(array) {
  let dates = [];
  let date_string = [];

  for (let i = 0; i < array.length; i++) {
    let date = array[i].date_string;

    let dateObject = new Date(date);
    array[i].date = dateObject;

    if (!date_string.includes(array[i].date_string)) {
      date_string.push(array[i].date_string);
      dates.push(dateObject);
    }
  }

  return dates;
}

function formatAuthority(array) {
  return [...new Set(array.map((el) => el.authority))];
}

function formatResourceType(array) {
  return [...new Set(array.map((el) => el.type_of_resource))];
}

function formatStates(array) {
  // return [...new Set(row.map((r) => r.state))].map((state) => {
  //   return {
  //     name: row.find((r) => r.state === state).state_name,
  //     value: row.find((r) => r.state === state).state,
  //   };
  // });

  return [...new Set(array.map((el) => el.state))];
}
