<script>
  import Header from "./Header.svelte";
  import IntroContent from "./IntroContent.svelte";
  import Options from "./Options.svelte";
  import Table from "./Table.svelte";
  import About from "./About.svelte";
  import Footer from "./Footer.svelte";

  export let dataset;
  let selectedCategory = "";
  let selectedResourceType = "";
  let selectedAuthority = "";
  let selectedTags = [];
  let searchText;
  $: row = { isOpen: false };

  $: filteredData = () => {
    return dataset.data
      .filter((row) => {
        //console.log(row);
        // for Keyword Search
        const filteredActivity = searchText ? searchText : row.activity.title;
        // for dropdowns
        const filteredCategory = selectedCategory
          ? selectedCategory
          : row.category;
        const filteredResource = selectedResourceType
          ? selectedResourceType
          : row.type_of_resource;
        const filteredAuthority = selectedAuthority
          ? selectedAuthority
          : row.authority;
        const filteredTags =
          selectedTags.length > 0
            ? row.tags.some((tag) => selectedTags.includes(tag))
            : row.tags;

        return (
          (row.activity.title
            .toLowerCase()
            .includes(filteredActivity.toLowerCase()) ||
            row.category
              .toLowerCase()
              .includes(filteredActivity.toLowerCase()) ||
            row.type_of_resource
              .toLowerCase()
              .includes(filteredActivity.toLowerCase()) ||
            row.authority
              .toLowerCase()
              .includes(filteredActivity.toLowerCase())) &&
          row.category === filteredCategory &&
          row.type_of_resource === filteredResource &&
          row.authority === filteredAuthority &&
          filteredTags
        );
      })
      .sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        } else if (a.date > b.date) {
          return 1;
        } else {
          return 0;
        }
      });
  };
</script>

<div id="site-content">
  <Header />

  <IntroContent filteredData={filteredData()} />

  <section class="table-container">
    <Options
      {dataset}
      filteredData={filteredData()}
      bind:row
      bind:selectedAuthority
      bind:selectedResourceType
      bind:selectedCategory
      bind:selectedTags
      bind:searchText
    />

    <Table filteredData={filteredData()} bind:row />
  </section>
  <About />
  <Footer />
</div>

<style lang="scss">
  @use "../scss/components/table-container";
</style>
