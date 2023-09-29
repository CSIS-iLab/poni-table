<script>
  import { onMount } from "svelte"
  import tooltip from "../js/tooltip"
  import Icon from "./Icons.svelte"

  export let filteredData
  export let row

  let sortIconContainer
  $: sortClass = "inactive"

  const sortByColumns = [
    "date",
    "activity",
    "category",
    "speaker",
    "type of resource",
  ]

  function handleClick(e) {
    let title = undefined
    let currentRow = undefined
    let extraContent = undefined

    if (e.target.parentNode.classList.contains("title")) {
      title = e.target.parentNode
      currentRow = title.nextElementSibling
      extraContent = e.target.parentNode.nextElementSibling
    } else {
      title = e.target.parentNode.parentNode
      currentRow = title.nextElementSibling
      extraContent = e.target.parentNode.parentNode.nextElementSibling
    }

    title.classList.toggle("title--active")
    title.classList.toggle("table__body__cell--border")
    currentRow.classList.toggle("table__body__cell--border")
    // Show/Hide extraContent
    extraContent.classList.toggle("active")
    extraContent.classList.toggle("hide")
    row.isOpen ? (row.isOpen = true) : (row.isOpen = !row.isOpen)
  }

  const headerNames = [
    "Activity",
    "Date",
    "Category",
    "Speaker",
    "Type of Resource",
  ]

  $: sortBy = { col: "activity", ascending: true }

  $: sort = (e, column) => {
    column = column.toLowerCase().replace(/\s/g, "_") // replace spaces using regex with undesrscore
    const iconsActive = document.querySelectorAll(".sort-icon--active")
    iconsActive.forEach((icon) => {
      icon.classList.remove("sort-icon--active")
    })
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending
      sortClass = sortBy.ascending ? "active" : "inactive"
    } else {
      sortClass = "inactive"
      sortBy.col = column
      sortBy.ascending = true
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1

    // current function - does NOT also sort by date,
    // only puts event titles in alpha order
    let sortActivity = (a, b) =>
      a.activity.title < b.activity.title
        ? -1 * sortModifier
        : a.activity.title > b.activity.title
        ? 1 * sortModifier
        : 0

    // possible option - will sort by date, and then
    // within that date, sort events by alpha order
    // so dates within 01/01/22 - 01/31/22 are in alpha order,
    // then dates 02/01/22 - 02/28/22 are in alpha order.
    // not called right now -- user probably expects only alpha sort
    let sortByNameThenDate = (a, b) => {
      let rv = a.date - b.date
      if (rv === 0) {
        rv = a.activity.title.localeCompare(b.activity.title)
      }
      return rv
    }

    let sortDate = (a, b) =>
      a.date < b.date
        ? -1 * sortModifier
        : a.date > b.date
        ? 1 * sortModifier
        : 0

    let sortColumnName = (a, b) =>
      a[column] < b[column]
        ? -1 * sortModifier
        : a[column] > b[column]
        ? 1 * sortModifier
        : 0

    //Sort by activity title
    if (column == "activity") {
      console.log(
        "filteredData",
        (filteredData = filteredData.sort(sortActivity)),
      )
      return (filteredData = filteredData.sort(sortActivity))
    }

    filteredData = filteredData.sort(sortDate).sort(sortColumnName)
  }

  onMount(() => {
    const iconsActive = document.querySelectorAll(".sort-icon--active")
    iconsActive.forEach((icon) => {
      icon.classList.remove("sort-icon--active")
    })
    const divActivity = document.querySelector(
      ".table__cell--header__container__activity",
    )
    divActivity.children[1].children[1].classList.add("sort-icon--active")
    // Sync horizontal scroll of table header and table body
    // Inspired by https://codepen.io/Goweb/pen/rgrjWx
    const scrollSync = () => {
      const tableHeader = document.querySelector("#table-header")
      const tableBody = document.querySelector("#table-body")

      const bindSyncScrolling = (one, two) => {
        let echo = false
        const sync = (elOne, elTwo) => () =>
          (echo = !echo) &&
          ((elOne.scrollTop = elTwo.scrollTop),
          (elOne.scrollLeft = elTwo.scrollLeft))
        two.onscroll = sync(one, two)
        one.onscroll = sync(two, one)
      }
      bindSyncScrolling(tableHeader, tableBody)
    }
    scrollSync()
  })
</script>

<div class="table__wrapper">
  <div class="table__container table__container--sticky" id="table-header">
    <table class="table">
      <thead>
        <tr class="table__header-row">
          {#each headerNames as name}
            <th class="table__cell--header" scope="col">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="table__cell--header__container table__cell--header__container__{name
                  .toLowerCase()
                  .split(' ')
                  .join('-')}"
                on:click={sortByColumns.includes(name.toLowerCase())
                  ? (e) => sort(e, name)
                  : ""}
              >
                <span>{name}</span>
                {#if sortByColumns.includes(name.toLowerCase())}
                  <div
                    class="sort-icons-container"
                    on:click={(e) => sort(e, name)}
                  >
                    <button
                      class="sort-icon sort-icon--{sortBy.col ==
                        name.toLowerCase().split(' ').join('_') &&
                      sortBy.ascending
                        ? 'inactive'
                        : 'active'}">▲</button
                    >
                    <button
                      class="sort-icon sort-icon--{sortBy.col ==
                        name.toLowerCase().split(' ').join('_') &&
                      sortBy.ascending
                        ? 'active'
                        : 'inactive'}">▼</button
                    >
                  </div>
                {/if}
              </div>
            </th>
          {/each}
        </tr>
      </thead>
    </table>
  </div>
  <div class="table__container" id="table-body">
    <table class="table table__body">
      <tbody>
        {#each filteredData as rows}
          <tr
            on:click={(e) => handleClick(e)}
            class="title table__body__cell--border {(rows.key_moment !== null) ? 'key-moment' : '' }"
          >
            <!-- event name/title -->
            <td class="table__body__cell table__body__cell--data"
              ><div class="table__body__cell__title-container">
                {#if (rows.key_moment !== null) }
                <span>o</span>
                {/if}
                <span class="icon-container" />{rows.activity.title}
              </div></td
            >
            <!-- event date - displays string value -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.date_string}</td
            >
            <!-- event category -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.category}</td
            >
            <!-- event speaker -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.speaker}</td
            >
            <!-- event type -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.type}</td
            >
          </tr>
          <!--this tr is the stuff under the dropdown -->
          <tr class="extra-content hide">
            <td class="table__body__cell" colspan="6">
              <div class="extra-content__container">
                <div class="description">{rows.activity.quote}</div>
                {#if rows.activity.image_url && rows.activity.image_source}
                  <!-- TODO: add styles for img and the photo credit -->
                  <img
                    loading="lazy"
                    src={rows.activity.image_url}
                    alt={rows.activity.image_source}
                  />
                  <span><b>Photo Credit:</b> {rows.activity.image_source}</span>
                {/if}
                <div class="link">
                  {#each rows.activity.sources as source}
                    {#if source[0] != ""}
                      <a
                        href={source[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        >Go to resource<span class="icon-container"
                          ><Icon name="Icon-open-blank" class="icon" /></span
                        >
                      </a>
                      {#if source[1] == 1}
                        <span
                          class="icon-tag-container"
                          use:tooltip={{ theme: "energy" }}
                          aria-hidden="true"
                          aria-label="A vpn is required to view this source."
                          ><Icon name="Icon-info-alt" class="icon" /></span
                        >
                      {/if}
                    {/if}
                  {/each}
                </div>
              </div>
            </td>
          </tr>
        {:else}
          <!-- if filters return an empty table -->
          <tr>
            <td class="table__body__cell table__body__cell--no-data" colspan="6"
              ><p class="table__body__cell__no-data__title">0 entries found.</p>
              <p class="table__body__cell__no-data__desc">
                Try changing or removing filters to adjust the results.
              </p>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  @use "../scss/abstracts/" as *;
  @use "../scss/components/table";
  :global(.tippy-box[data-theme~="energy"]) {
    @extend %text-style-ui-4;
    color: $color-text-gray-500;
    background-color: $color-background-white;
    padding: rem(6) rem(6) rem(8) rem(6);
    filter: drop-shadow(0px 1px 9px rgba(0, 0, 0, 0.06))
      drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  }

  :global(
      .tippy-box[data-theme~="energy"][data-placement^="top"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="energy"][data-placement^="bottom"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="energy"][data-placement^="left"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="energy"][data-placement^="right"]
        > .tippy-arrow::before
    ) {
    border-top-color: $color-background-white;
  }
</style>
