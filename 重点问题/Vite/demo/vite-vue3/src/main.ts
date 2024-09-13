import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

console.log("import.meta.env", import.meta.env);

createApp(App).mount("#app");
