import * as d3Fetch from 'd3-fetch'

const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbsWyNWxgbsJJd2AuaoNIJ2KkEplWSNK77gxcS_WndRrj1rNnPoxtPNl60HjlmdvQo4UvxBUMEi1S/pub?output=csv";

const policyGoals = ['Emissions_Reduction', 'Economic_Development', 'Resilience']
const tags = ['Anticipating_Climate_Impacts', 'Comprehensive_Planning_Grid_Modernization', 'Data_Transparency_or_Visualization', 'Electric_Vehicles', 'Energy_Storage', 'Environmental_Justice', 'Innovation_and_Clusters', 'Local-Level_Planning_or_Support', 'Microgrids', 'Distributed_Energy_Resources_(DERs)', 'Technology_or_System_Standards', 'Workforce_Development']

export default function getData() {
  const dataPromise = d3Fetch.csv(URL).then(res => {

    const data = res.map((row, index) => {
      return {
        id: index,
        policy_goals: policyGoals.filter((goalName) => row[goalName]),
        tags: tags.filter((tagName) => row[tagName]).map(tagName => tagName.split('_').join(' ')),
        activity: {
          title: row.title,
          description: row.description,
          link: row.URL
        },
        state: row.state,
        state_name: row.state_name,
        authority: row.authority,
        type_of_resource: row.type_of_resource,
      }
    })

    const authority = formatAuthority(data)

    const resourceTypes = formatResourceType(data)

    const states = formatStates(data)

    return {
      data: data,
      states: states,
      tags: tags.map(tagName => tagName.split('_').join(' ')),
      authority: authority,
      resourceTypes: resourceTypes,
      policyGoals: policyGoals,
    }
  })
  return dataPromise
}

function formatAuthority(array) {
  return [...new Set(array.map(el => el.authority))]
}

function formatResourceType(array) {
  return [...new Set(array.map(el => el.type_of_resource))]
}

function formatStates(row) {
  return [...new Set(row.map(r => r.state))]
    .map(state => {
      return {
        name: row.find(r => r.state === state).state_name,
        value: row.find(r => r.state === state).state,
      }
    })
}
