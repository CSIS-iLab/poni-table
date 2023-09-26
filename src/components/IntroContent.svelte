<script>
  import Icon from "./Icons.svelte";

  export let filteredData;
  let authorities = [];
  let tags = [];
  const totalEntries = filteredData.length;

  function getMostReferencedAuthorities() {
    filteredData.forEach((element) => {
      authorities.push(element.authority);
    });
    return countOccurences(authorities);
  }

  function getTopTags() {
    filteredData.forEach((element) => {
      element.tags.forEach((tag) => {
        tags.push(tag);
      });
    });
    return countOccurences(tags);
  }

  function countOccurences(array) {
    const counts = {};
    array.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    return getTopThree(counts);
  }

  function getTopThree(obj) {
    const sortable = Object.fromEntries(
      Object.entries(obj).sort(([, a], [, b]) => b - a)
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

  const topTags = getTopTags();
  const mostReferencedAuhorities = getMostReferencedAuthorities();
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
        <div class="intro-bar__title">Most Referenced Authorities</div>
        <div class="intro-bar__content">
          <div class="intro-bar__column--labels">
            <!-- iterate and add the most refereced authorities -->
            {#each mostReferencedAuhorities as authority}
              <div><span>{Object.keys(authority)}</span></div>
            {/each}
          </div>
          <div
            class="intro-bar__column--bars"
            data-total-entries={totalEntries}
          >
            <!-- iterate and add the most refereced authorities values -->
            {#each mostReferencedAuhorities as authority}
              <div class="bar">
                <span
                  style="width: {(Object.values(authority) / totalEntries) *
                    100}%"
                />{Object.values(authority)}
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="intro-bar">
        <div class="intro-bar__title">Top Tags</div>
        <div class="intro-bar__content">
          <div class="intro-bar__column--labels">
            <!-- iterate and add the top tags -->
            {#each topTags as tag}
              <div><span>{Object.keys(tag)}</span></div>
            {/each}
          </div>
          <div
            class="intro-bar__column--bars"
            data-total-entries={totalEntries}
          >
            <!-- iterate and add the top tags values -->
            {#each topTags as tag}
              <div class="bar">
                <span
                  style="width:  {(Object.values(tag) / totalEntries) * 100}%"
                />{Object.values(tag)}
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
