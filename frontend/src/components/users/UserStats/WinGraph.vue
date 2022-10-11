<template>
  <div class="pieChart">
    <DoughnutChart :chartData="getData()" :options="options" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref } from "vue";
import { defineProps } from "vue";
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables, TooltipItem } from "chart.js";

interface Props {
  totalGames: number;
  totalVictories: number;
}

const props: Readonly<Props> = defineProps<Props>();
const data = {
  labels: ["Win", "Loose"],
  datasets: [
    {
      data: [props.totalVictories, props.totalGames - props.totalVictories],
      backgroundColor: ["#ffcb00", "#005f3e"],
      borderWidth: 0,
      spacing: 0,
      hoverOffset: 4,
    },
  ],
};
const empty = {
  datasets: [
    {
      data: [1],
      backgroundColor: ["#bebebe"],
      borderWidth: 0,
      spacing: 0,
      hoverOffset: 4,
    },
  ],
};

const options = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      intersect: false,
      callbacks: {
        label: (item: TooltipItem<"doughnut">) => {
          if (props.totalGames == 0) return " no data";
          return " " + item.parsed;
        },
      },
    },
  },
  animation: {
    animateScale: true,
  },
  layout: {
    padding: 5,
    width: 50,
  },
});

function getData() {
  if (props.totalGames == 0) return empty;
  return data;
}

Chart.register(...registerables);

defineExpose(
  defineComponent({
    name: "WinGraph",
  })
);
</script>

<style>
.pieChart {
  position: relative;
  width: 100px;
  height: 100px;
}
</style>
