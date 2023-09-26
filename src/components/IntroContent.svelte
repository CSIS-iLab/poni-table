<script>
  import Icon from "./Icons.svelte";

  export let filteredData;
  let authorities = [];
  const totalEntries = filteredData.length;

  // for  bar chart at the top of the page
  function getMostReferencedSpeakers() {
    filteredData.forEach((element) => {
      if (element.speaker != "") {
        authorities.push(element.speaker);
      }
    });
    return countOccurences(authorities);
  }
  // get MostReferencedSpeakers count
  function countOccurences(array) {
    const counts = {};
    array.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    return getTopThree(counts);
  }
  // get top top 3 most referenced speakers
  function getTopThree(obj) {
    const sortable = Object.fromEntries(
      Object.entries(obj).sort(([, a], [, b]) => b - a),
    );

    let topThree = [];
    let objNames = Object.keys(sortable);

    objNames.forEach((name, i) => {
      if (i < 3) {
        topThree.push({ [name]: sortable[name] });
      }
    });
    return topThree;
  }

  const mostReferencedSpeakers = getMostReferencedSpeakers();
</script>

<div class="wrapper">
  <main class="container intro-content">
    <p class="intro-content__overline--regular">
      By the Project on Nuclear Issues
    </p>
    <h1 class="intro-content__title">Russian Nuclear Threats Timeline</h1>
    <p class="intro-content__introduction">
      A curated database of events illustrating the evolution of nuclear threats
      in the leadup to - and throughout the first year of - the War in Ukraine.
      From the <a
        class="intro-content__link"
        href="https://www.csis.org/programs/international-security-program/project-nuclear-issues"
        target="_blank">CSIS Project on Nuclear Issues</a
      >.
    </p>
    <p class="intro-content__more">
      <a class="intro-content__link intro-content__link--more" href="#about"
        ><span class="intro-content__more__icon-container">
          <Icon class="icon__info" name="Icon-info" />
        </span><span>More on this database</span></a
      >
    </p>
  </main>
  <div class="container">
    <div class="intro-content__graphs">
      <div class="intro-bar">
        <div class="intro-bar__title">Most Referenced Speakers</div>
        <div class="intro-bar__content">
          <div class="intro-bar__column--labels">
            <!-- iterate and add the mostReferencedSpeakers to chart -->
            {#each mostReferencedSpeakers as speaker}
              <div><span>{Object.keys(speaker)}</span></div>
            {/each}
          </div>
          <div
            class="intro-bar__column--bars"
            data-total-entries={totalEntries}
          >
            <!-- iterate and add the mostReferencedSpeakers values -->
            {#each mostReferencedSpeakers as speaker}
              <div class="bar">
                <span
                  style="width: {(Object.values(speaker) / totalEntries) *
                    100}%"
                />{Object.values(speaker)}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use "../scss/components/intro-content";
</style>
