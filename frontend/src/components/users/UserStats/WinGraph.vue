<template>
  <div class="pieChart">
    <DoughnutChart :chartData="getData()" :options="options" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, onUpdated, ref } from "vue";
import { defineProps, onBeforeMount } from "vue";
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables, TooltipItem } from "chart.js";

interface Props {
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
}

const props: Readonly<Props> = defineProps<Props>();
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
const dataRef = ref();
dataRef.value = empty;

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
          if (props.totalGames == props.totalDraws) return " no data";
          return " " + item.parsed + " " + item.label;
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
  if (props.totalGames == props.totalDraws) return empty;
  return dataRef.value;
}

function updateData() {
  dataRef.value = {
    labels: ["win", "loose"],
    datasets: [
      {
        data: [
          props.totalVictories,
          props.totalGames - props.totalVictories - props.totalDraws,
        ],
        backgroundColor: ["#ffcb00", "#005f3e"],
        borderWidth: 0,
        spacing: 0,
        hoverOffset: 4,
      },
    ],
  };
}

onUpdated(() => {
  updateData();
});

onBeforeMount(() => {
  updateData();
});

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
