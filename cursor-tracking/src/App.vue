<template>
  <div class="app-container">
    <h1>Real-time Cursor Tracking</h1>
  <TabView>
    <TabPanel header="Режим просмотра">
      <CursorCanvas/>
    </TabPanel>
    <TabPanel header="История">
      <HistoryViewer/>
    </TabPanel>
  </TabView>
  </div>
</template>

<script>
import CursorCanvas from './components/CursorCanvas.vue';
import HistoryViewer from './components/HistoryViewer.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

export default {
  components: {
    CursorCanvas,
    HistoryViewer,
    TabView,
    TabPanel
  }
};
</script>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

body {
  font-family: Arial, sans-serif;
}
</style>