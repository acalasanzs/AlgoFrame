import "./style.css";
import { createBoxes } from "./utils";
// import {Animate} from "@";

const root = document.getElementById("app")!;

const boxes = 5;

const boxElements = createBoxes(root, boxes);